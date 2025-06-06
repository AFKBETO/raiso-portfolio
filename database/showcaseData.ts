import { ShowcaseModel, type ShowcaseImgInt } from "./ShowcaseModel";

export async function fetchAllShowcaseImages(): Promise<ShowcaseImgInt> {
  const result = await ShowcaseModel
    .aggregate<ShowcaseImgInt>()
    .lookup({
        from: 'works',
        localField: 'showcases',
        foreignField: '_id',
        pipeline: [
          {
            $addFields: {
              title: {
                $cond: {
                  if: { $eq: ['$title', 'N/A'] },
                  then: {
                    $getField: {
                      field: 'title',
                      input: { $arrayElemAt: ['$pieces', 0] },
                    },
                  },
                  else: '$title',
                },
              },
              imageUrl: {
                $getField: {
                  field: 'imageUrl',
                  input: { $arrayElemAt: ['$pieces', 0] }
                }
              }
            },
          },{
            $project: {
              title: 1,
              imageUrl: 1
            }
          }
        ],
        as: 'showcases'
      });

    return result[0];
}