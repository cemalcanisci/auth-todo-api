const { Op } = require('sequelize');
const { Group, Todo } = require('../models');
const { errorMessage, checkRequiredFields } = require('../helpers/valitadion');
const { STATUS } = require('../constants/enums');
const { ACTIVE, COMPLETED } = STATUS;
const allowedStatus = [ACTIVE, COMPLETED];

const todoByUserAndGroup = async (todoId, userId, groupId = null) => {
  const todo = await Todo.findOne({
    where: {
      id: todoId,
    },
  });

  if (!todo) {
    return { message: 'Todo not found', success: false };
  }

  if (todo.userId !== userId) {
    return { message: 'Todo is not of the specified user', success: false };
  }

  if (groupId && todo.groupId !== groupId) {
    return { message: 'Todo is not of the specified group', success: false };
  }

  return { todo, success: true };
};

const groupBelongUser = async (groupId, userId) => {
  if (!groupId) {
    return { message: 'Group is required', success: false };
  }

  const group = await Group.findOne({
    where: {
      id: Number(groupId),
    },
  });

  if (!group) {
    return { message: 'Group not found', success: false };
  }

  if (group.userId !== userId) {
    return {
      message: 'Group is not of the specified user',
      success: false,
    };
  }

  return {
    success: true,
  };
};

module.exports = {
  async fetch(req, res) {
    try {
      const { user } = req;
      const { id } = user;
      const { status, priority, groupId, minDueDate, maxDueDate } = req.query;

      const where = {
        userId: id,
        status,
      };

      if (priority) {
        where.priority = priority;
      }

      if (groupId) {
        where.groupId = groupId;
      }

      if (priority) {
        where.priority = priority;
      }

      if (minDueDate && maxDueDate) {
        where.dueDate = {
          [Op.and]: {
            [Op.gte]: minDueDate,
            [Op.lte]: maxDueDate,
          },
        };
      } else if (minDueDate) {
        where.dueDate = {
          [Op.gte]: minDueDate,
        };
      } else if (maxDueDate) {
        where.dueDate = {
          [Op.lte]: maxDueDate,
        };
      }

      const todos = await Todo.findAll({
        where,
      });

      res.send({
        data: todos,
        success: true,
      });
    } catch (error) {
      const err = error.message ? error.message : error;
      res.status(400).send({ message: err, success: false });
    }
  },

  async add(req, res) {
    try {
      const { user } = req;
      const { id } = user;
      const { text, priority, status, dueDate, groupId } = req.body;

      if (!allowedStatus.includes(status)) {
        return res
          .status(405)
          .send({ message: 'Status not allowed', success: false });
      }

      const isMyGroup = await groupBelongUser(groupId, id);

      if (!isMyGroup.success) {
        return res
          .status(401)
          .send({ message: isMyGroup.message, success: false });
      }

      const todo = await Todo.create({
        text,
        priority,
        status,
        dueDate,
        groupId,
        userId: id,
      });
      res.json({
        data: todo,
        success: true,
      });
    } catch (error) {
      res.status(400).send(errorMessage(error));
    }
  },

  async edit(req, res) {
    try {
      const { user } = req;
      const userId = user.id;
      const { text, priority, status, dueDate, groupId } = req.body;

      const checkFields = checkRequiredFields({
        Todo: text,
        Priority: priority,
        Status: status,
        DueDate: dueDate,
        GroupId: groupId,
      });

      if (!checkFields.success) {
        return res
          .status(400)
          .send({ message: checkFields.message, success: false });
      }

      const { id } = req.params;
      const checkTodo = await todoByUserAndGroup(id, userId);

      if (!checkTodo.success) {
        return res
          .status(400)
          .send({ message: checkTodo.message, success: false });
      }

      const checkGroup = await groupBelongUser(groupId, userId);

      if (!checkGroup.success) {
        return res
          .status(400)
          .send({ message: checkGroup.message, success: false });
      }

      await Todo.update(
        {
          text,
          priority,
          status,
          dueDate,
          groupId,
        },
        {
          where: {
            id,
          },
        }
      );

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(400).send(errorMessage(error));
    }
  },

  async updateStatus(req, res) {
    try {
      const { user } = req;
      const userId = user.id;
      const { status } = req.body;

      const checkFields = checkRequiredFields({
        Status: status,
      });

      if (!allowedStatus.includes(status)) {
        return res
          .status(405)
          .send({ message: 'Status not allowed', success: false });
      }

      if (!checkFields.success) {
        return res
          .status(400)
          .send({ message: checkFields.message, success: false });
      }

      const { id } = req.params;
      const checkTodo = await todoByUserAndGroup(id, userId);

      if (!checkTodo.success) {
        return res
          .status(400)
          .send({ message: checkTodo.message, success: false });
      }

      await Todo.update(
        {
          status,
        },
        {
          where: {
            id,
          },
        }
      );
      res.json({
        success: true,
      });
    } catch (error) {
      res.status(400).send(errorMessage(error));
    }
  },

  async remove(req, res) {
    try {
      const { user } = req;
      const userId = user.id;
      const { id } = req.params;

      const todo = await todoByUserAndGroup(id, userId);

      if (!todo.success) {
        res.status(404).send({ message: todo.message, success: false });
      }
      await Todo.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.json({
        success: true,
      });
    } catch (error) {
      res.status(400).send(errorMessage(error));
    }
  },
};
