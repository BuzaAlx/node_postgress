const db = require("../db/config");
const { asyncFilter } = require("../helpers");

class UserController {
  async createUser(req, res) {
    const { first_name, gender } = req.body;
    try {
      const newUser = await db.query(
        "INSERT INTO person (first_name,gender) values ($1, $2) RETURNING *",
        [first_name, gender]
      );
      res.status(200);
      res.json(newUser.rows[0]);
    } catch (error) {
      res.status(400);
      res.send("Something went wrong");
    }
  }

  async getUsers(req, res) {
    try {
      const users = await db.query("SELECT * FROM person");
      res.status(200);
      res.json(users.rows);
    } catch (error) {
      console.error(error);
      res.status(400);
      res.send("Something went wrong");
    }
  }

  async getOneUser(req, res) {
    const id = req.params.id;
    try {
      const users = await db.query("SELECT * FROM person WHERE id = $1", [id]);
      res.status(200);
      res.json(users.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(400);
      res.send("Something went wrong");
    }
  }

  async getUserFriends(req, res) {
    const { order_by, order_type } = req.query;
    const id = req.params.id;

    try {
      const followedByUser = await db.query(
        `SELECT * FROM follower WHERE following_user_id = $1`,
        [id]
      );

      const filteredUserToResponse = await asyncFilter(
        followedByUser.rows,
        async (user) => {
          const { followed_user_id } = user;

          const result = await db.query(
            "SELECT * FROM follower WHERE following_user_id = $1 AND followed_user_id = $2",
            [followed_user_id, id]
          );

          return result.rows[0];
        }
      );
      const mapUserToResponse = async ({ followed_user_id }) => {
        const users = await db.query("SELECT * FROM person WHERE id = $1", [
          followed_user_id,
        ]);
        return { first_name: users.rows[0].first_name, id: users.rows[0].id };
      };

      const mappedData = await Promise.all(
        filteredUserToResponse.map(mapUserToResponse)
      );

      if (order_by && order_type) {
        mappedData.sort((a, b) => {
          if (a[order_by] < b[order_by]) {
            return order_type === "asc" ? 1 : -1;
          } else if (a[order_by] > b[order_by]) {
            return order_type === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      res.status(200);
      res.json(mappedData);
    } catch (error) {
      console.error(error);
      res.status(200);
      res.send("Something went wrong");
    }
  }
}

module.exports = new UserController();
