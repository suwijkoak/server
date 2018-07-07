import express from "express";
import Message from "../schema/Message";
const router = express.Router();

router.get("/", async (req, res, next) => {
  let messages = await Message.find({});
  return res.json(messages);
});

router.post("/create", async (req, res, next) => {
  const { message } = req.body;
  const user = req.user;
  let messageTable = new Message();
  messageTable.message = message;
  messageTable.userId = user._id;
  try {
    await messageTable.save();
    res.json({
      alert: {
        title: "Success !",
        message: "Message was created succesfully !",
        docs: updateMessage
      },
      message: messageTable
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/update", async (req, res) => {
  const { message, _id } = req.body;
  try {
    let updateMessage = await Message.update(
      { _id: _id },
      { $set: { message: message } }
    );
    let updatedMessage = await Message.findById(_id);
    res.json({
      alert: {
        title: "Success !",
        message: "Message was updated succesfully !",
        docs: updateMessage
      },
      message: updatedMessage
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/remove", async (req, res) => {
  const { _id } = req.body;
  try {
    const messageRemove = await Message.remove({ _id: _id });
    res.json({
      alert: {
        title: "Success !",
        message: "Message was removed succesfully !",
        docs: messageRemove
      }
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/****************
/* Reply
/***************/
router.post("/addReply", async (req, res) => {
  const { _id, replyMessage } = req.body;
  try {
    let updateMessage = await Message.update(
      { _id: _id },
      { $push: { replies: { userId: req.user._id, message: replyMessage } } }
    );
    let updatedMessage = await Message.findById(_id);
    res.json({
      alert: {
        title: "Success !",
        message: "Reply Message was added to message succesfully !",
        docs: updateMessage
      },
      message: updatedMessage
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/updateReply", async (req, res) => {
  const { messageId, replyId, replyMessage } = req.body;
  try {
    let updateMessage = await Message.update(
      { _id: messageId, "replies._id": replyId },
      { $set: { "replies.$.message": replyMessage } }
    );
    let updatedMessage = await Message.findById(messageId);
    res.json({
      alert: {
        title: "Success !",
        message: "Reply Message was added to message succesfully !",
        docs: updateMessage
      },
      message: updatedMessage
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/removeReply", async (req, res) => {
  const { messageId, replyId } = req.body;
  try {
    let updateMessage = await Message.update(
      { _id: messageId },
      { $pull: { replies: { _id: replyId } } }
    );
    let updatedMessage = await Message.findById(_id);
    res.json({
      alert: {
        title: "Success !",
        message: "Reply Message was removed succesfully !",
        docs: updateMessage
      },
      message: updatedMessage
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
