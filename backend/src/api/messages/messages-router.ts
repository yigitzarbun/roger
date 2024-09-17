import { Request, Response, NextFunction, Router } from "express";
import messagesModel from "./messages-model";

const messagesRouter = Router();

messagesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await messagesModel.getAll();
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
);
messagesRouter.get(
  "/user-messages/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await messagesModel.getMessagesByUserId(
        Number(req.params.userId)
      );
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
);
messagesRouter.get(
  "/user-chats/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const messages = await messagesModel.getChatsByFilter(filter);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
);
messagesRouter.get(
  "/chat-messages/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const messages = await messagesModel.getChatMessages(filter);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
);
messagesRouter.get(
  "/paginated-recipients-list/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const paginatedRecipientsList =
        await messagesModel.getPaginatedMessageRecipientsListByFilter(filter);
      res.status(200).json(paginatedRecipientsList);
    } catch (error) {
      next(error);
    }
  }
);
messagesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await messagesModel.add(req.body);
      console.log("message: ", message);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
);

export default messagesRouter;
