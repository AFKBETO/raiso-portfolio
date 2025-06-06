import { Document, model, Schema } from "mongoose";
import type { WorkTitleInt } from "./WorkModel";

export interface ShowcaseInt extends Document {
  showcases: WorkTitleInt[];
}

export interface WorkImgInt extends Document {
  _id: string;
  title: string;
  imageUrl:string;
}


export interface ShowcaseImgInt {
  showcases: WorkImgInt[];
}

export const ShowcaseSchema = new Schema<ShowcaseInt>({
  showcases: [{
    type: Schema.Types.ObjectId,
    ref: 'Work'
  }]
});

export const ShowcaseModel = model('Showcase', ShowcaseSchema, 'showcases');