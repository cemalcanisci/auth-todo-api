const { Group } = require('../models');
const { errorMessage } = require('../helpers/valitadion');

const findUserGroupById = async (id, userId) => {
  try {
    const group = await Group.findOne({
      where: {
        userId,
        id,
      },
    });
    if (group) {
      return group;
    }
    return false;
  } catch (error) {
    return false;
  }
};

module.exports = {
  async fetch(req, res) {
    try {
      const { user } = req;
      const { id } = user;
      const groups = await Group.findAll({
        where: {
          userId: id,
        },
      });

      res.send({
        data: groups,
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
      const { name } = req.body;

      const group = await Group.create({
        name,
        userId: id,
      });
      return res.json({
        data: group,
        success: true,
      });
    } catch (error) {
      return res.status(400).send(errorMessage(error));
    }
  },

  async edit(req, res) {
    try {
      const { user } = req;
      const userId = user.id;
      const { name } = req.body;
      const { id } = req.params;

      if (!name) {
        return res
          .status(400)
          .send({ message: 'Group name is required', success: false });
      }
      const group = await findUserGroupById(id, userId);

      if (!group) {
        res.status(404).send({ message: 'Group not found', success: false });
      }

      await Group.update(
        {
          name,
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

      const group = await findUserGroupById(id, userId);

      if (!group) {
        res.status(404).send({ message: 'Group not found', success: false });
      }

      await Group.destroy({
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
