const db = require("../../data/dbconfig");

const messagesModel = {
  async getAll() {
    const chats = await db("messages");
    return chats;
  },
  async getMessagesByUserId(userId: number) {
    try {
      const messages = await db
        .select(
          "messages.message_id",
          "messages.registered_at",
          "messages.is_active as is_message_active",
          "messages.sender_id as message_sender_user_id",
          "messages.recipient_id as message_recipient_user_id",
          "messages.message_content",
          "users_sender.user_status_type_id",
          "users_sender.user_type_id",
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN players_recipient.fname
          ELSE players_sender.fname
        END as player_fname
      `,
            [userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN players_recipient.lname
          ELSE players_sender.lname
        END as player_lname
      `,
            [userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN trainers_recipient.fname
          ELSE trainers_sender.fname
        END as trainer_fname
      `,
            [userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN trainers_recipient.lname
          ELSE trainers_sender.lname
        END as trainer_lname
      `,
            [userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN clubs_recipient.club_name
          ELSE clubs_sender.club_name
        END as club_name
      `,
            [userId]
          )
        )
        .from("messages")
        .leftJoin(
          "users as users_sender",
          "users_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "users as users_recipient",
          "users_recipient.user_id",
          "messages.recipient_id"
        )
        .leftJoin(
          "players as players_sender",
          "players_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "players as players_recipient",
          "players_recipient.user_id",
          "messages.recipient_id"
        )
        .leftJoin(
          "trainers as trainers_sender",
          "trainers_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "trainers as trainers_recipient",
          "trainers_recipient.user_id",
          "messages.recipient_id"
        )
        .leftJoin(
          "clubs as clubs_sender",
          "clubs_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "clubs as clubs_recipient",
          "clubs_recipient.user_id",
          "messages.recipient_id"
        )
        .where("messages.sender_id", userId)
        .orWhere("messages.recipient_id", userId);

      return messages;
    } catch (error) {
      console.log("Error fetching user chats: ", error);
    }
  },
  async getChatsByFilter(filter) {
    try {
      const latestMessages = await db
        .with("ranked_messages", (qb) => {
          qb.select(
            "messages.message_id",
            "messages.sender_id",
            "messages.recipient_id",
            "messages.message_content",
            "messages.registered_at",
            "users_sender.user_status_type_id",
            "users_sender.user_type_id",
            db.raw(
              `
                        CASE
                            WHEN messages.sender_id = ? THEN players_recipient.fname
                            ELSE players_sender.fname
                        END as player_fname
                    `,
              [filter.userId]
            ),
            db.raw(
              `
                        CASE
                            WHEN messages.sender_id = ? THEN players_recipient.lname
                            ELSE players_sender.lname
                        END as player_lname
                    `,
              [filter.userId]
            ),
            db.raw(
              `
                        CASE
                            WHEN messages.sender_id = ? THEN players_recipient.image
                            ELSE players_sender.image
                        END as player_image
                    `,
              [filter.userId]
            ),
            db.raw(
              `
                        CASE
                            WHEN messages.sender_id = ? THEN trainers_recipient.fname
                            ELSE trainers_sender.fname
                        END as trainer_fname
                    `,
              [filter.userId]
            ),
            db.raw(
              `
                        CASE
                            WHEN messages.sender_id = ? THEN trainers_recipient.lname
                            ELSE trainers_sender.lname
                        END as trainer_lname
                    `,
              [filter.userId]
            ),
            db.raw(
              `
                        CASE
                            WHEN messages.sender_id = ? THEN clubs_recipient.club_name
                            ELSE clubs_sender.club_name
                        END as club_name
                    `,
              [filter.userId]
            ),
            db.raw(
              `
                        CASE
                            WHEN messages.sender_id = ? THEN clubs_recipient.image
                            ELSE clubs_sender.image
                        END as club_image
                    `,
              [filter.userId]
            ),
            db.raw(
              `
                        ROW_NUMBER() OVER (
                            PARTITION BY CASE
                                WHEN messages.sender_id = ? THEN messages.recipient_id
                                ELSE messages.sender_id
                            END
                            ORDER BY messages.registered_at DESC
                        ) as rn
                    `,
              [filter.userId]
            )
          )
            .from("messages")
            .leftJoin(
              "users as users_sender",
              "users_sender.user_id",
              "messages.sender_id"
            )
            .leftJoin(
              "users as users_recipient",
              "users_recipient.user_id",
              "messages.recipient_id"
            )
            .leftJoin(
              "players as players_sender",
              "players_sender.user_id",
              "messages.sender_id"
            )
            .leftJoin(
              "players as players_recipient",
              "players_recipient.user_id",
              "messages.recipient_id"
            )
            .leftJoin(
              "trainers as trainers_sender",
              "trainers_sender.user_id",
              "messages.sender_id"
            )
            .leftJoin(
              "trainers as trainers_recipient",
              "trainers_recipient.user_id",
              "messages.recipient_id"
            )
            .leftJoin(
              "clubs as clubs_sender",
              "clubs_sender.user_id",
              "messages.sender_id"
            )
            .leftJoin(
              "clubs as clubs_recipient",
              "clubs_recipient.user_id",
              "messages.recipient_id"
            )
            .where((builder) => {
              if (filter.textSearch && filter.textSearch.trim() !== "") {
                builder.where(function () {
                  this.where(
                    "players_sender.fname",
                    "ilike",
                    `%${filter.textSearch}%`
                  )
                    .orWhere(
                      "players_sender.lname",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "players_recipient.fname",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "players_recipient.lname",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "trainers_sender.fname",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "trainers_sender.lname",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "trainers_recipient.fname",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "trainers_recipient.lname",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "clubs_sender.club_name",
                      "ilike",
                      `%${filter.textSearch}%`
                    )
                    .orWhere(
                      "clubs_recipient.club_name",
                      "ilike",
                      `%${filter.textSearch}%`
                    );
                });
              }
            })
            .andWhere(function () {
              this.where("messages.sender_id", filter.userId).orWhere(
                "messages.recipient_id",
                filter.userId
              );
            });
        })
        .select("*")
        .from("ranked_messages")
        .where("rn", 1);

      return latestMessages;
    } catch (error) {
      console.log("Error fetching user chats: ", error);
      throw error;
    }
  },
  async getChatMessages(filter) {
    try {
      const messages = await db
        .select(
          "messages.message_id",
          "messages.registered_at",
          "messages.is_active as is_message_active",
          "messages.sender_id as message_sender_user_id",
          "messages.recipient_id as message_recipient_user_id",
          "messages.message_content",
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN players_recipient.fname
          ELSE players_sender.fname
        END as player_fname
      `,
            [filter.userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN players_recipient.lname
          ELSE players_sender.lname
        END as player_lname
      `,
            [filter.userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN trainers_recipient.fname
          ELSE trainers_sender.fname
        END as trainer_fname
      `,
            [filter.userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN trainers_recipient.lname
          ELSE trainers_sender.lname
        END as trainer_lname
      `,
            [filter.userId]
          ),
          db.raw(
            `
        CASE
          WHEN messages.sender_id = ? THEN clubs_recipient.club_name
          ELSE clubs_sender.club_name
        END as club_name
      `,
            [filter.userId]
          )
        )
        .from("messages")
        .leftJoin(
          "users as users_sender",
          "users_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "users as users_recipient",
          "users_recipient.user_id",
          "messages.recipient_id"
        )
        .leftJoin(
          "players as players_sender",
          "players_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "players as players_recipient",
          "players_recipient.user_id",
          "messages.recipient_id"
        )
        .leftJoin(
          "trainers as trainers_sender",
          "trainers_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "trainers as trainers_recipient",
          "trainers_recipient.user_id",
          "messages.recipient_id"
        )
        .leftJoin(
          "clubs as clubs_sender",
          "clubs_sender.user_id",
          "messages.sender_id"
        )
        .leftJoin(
          "clubs as clubs_recipient",
          "clubs_recipient.user_id",
          "messages.recipient_id"
        )
        .where(function () {
          this.where(function () {
            this.where("messages.sender_id", filter.userId).andWhere(
              "messages.recipient_id",
              filter.otherUserId
            );
          }).orWhere(function () {
            this.where("messages.sender_id", filter.otherUserId).andWhere(
              "messages.recipient_id",
              filter.userId
            );
          });
        })
        .orderBy("messages.registered_at", "asc");

      return messages;
    } catch (error) {
      console.log("Error fetching chat messages: ", error);
    }
  },
  async add(message) {
    const [newMessage] = await db("messages").insert(message).returning("*");
    console.log("message: model: ", message);
    return newMessage;
  },
};

export default messagesModel;
