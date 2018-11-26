// @flow
import type { $Request as Request, $Response as Response } from 'express';
import { validationResult } from 'express-validator/check';
import ImageService from '../services/ImageService';
import logger from '../logger';

export default {
  async add(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).send({
        messages: validationErrors.array().map(error => error.msg),
        errors: validationErrors.array(),
      });
    }
    const { id } = req.params;
    try {
      await ImageService.update(id, req.body.tags);
    } catch (err) {
      logger.error(err);
      if (err.response !== undefined) {
        return res.status(503).send({
          messages: ['Database Error!'],
          elija_response: {
            status: err.response.status,
            message: err.response.data,
          },
        });
      }
      return res.status(503).send({
        messages: ['Database unavailable!'],
      });
    }
    return res.status(200).send({ messages: ['Success!'] });
  },
};
