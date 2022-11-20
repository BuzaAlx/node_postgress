const db = require("../db/config");
const { asyncFilter } = require("../helpers");

class FollowerController {
  async addFollower(req, res) {
    const { following_user_id, followed_user_id } = req.body;

    const userSubscription = await db.query(
      "SELECT * FROM follower WHERE following_user_id = $1",
      [following_user_id]
    );

    if (userSubscription.rows.length >= 150) {
      res.send("you cand add more followers");
    }

    const newFollower = await db.query(
      "INSERT INTO follower (following_user_id,followed_user_id) values ($1, $2) RETURNING *",
      [following_user_id, followed_user_id]
    );

    res.json(newFollower.rows[0]);
  }

  async maxFollowind(req, res) {
    const result = await db.query(
      "SELECT following_user_id FROM follower GROUP BY following_user_id ORDER BY COUNT(*) DESC limit 5"
    );

    const mapUserToResponse = async ({ following_user_id }) => {
      const users = await db.query("SELECT * FROM person WHERE id = $1", [
        following_user_id,
      ]);
      return { first_name: users.rows[0].first_name, id: users.rows[0].id };
    };

    const mappedData = await Promise.all(result.rows.map(mapUserToResponse));

    res.send(mappedData);
  }

  async notFollowind(req, res) {
    const users = await db.query("SELECT * FROM person");

    const filteredUserToResponse = await asyncFilter(
      users.rows,
      async (user) => {
        const { id } = user;

        const result = await db.query(
          "SELECT * FROM follower WHERE following_user_id = $1",
          [id]
        );

        if (!result.rows[0]) {
          return true;
        }
      }
    );

    res.send(filteredUserToResponse);
  }
}

module.exports = new FollowerController();
