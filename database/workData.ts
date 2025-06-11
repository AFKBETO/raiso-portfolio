import { Types } from 'mongoose';
import { type PieceLocaleInt, type WorkImgInt, type WorkLocaleInt, WorkModel, type WorkTimelineInt } from './WorkModel';
import type { Locale } from '~/types/locale';

export async function getAllWorkTitles(): Promise<WorkTimelineInt[]> {
  return await WorkModel.aggregate<WorkTimelineInt>([{
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
    },
  },
  {
    $project: {
      pieces: 0,
      showcase: 0,
    },
  },
  {
    $group: {
      _id: '$year',
      works: {
        $push: {
          _id: '$_id',
          title: '$title',
        },
      },
    },
  },
  {
    $project: {
      year: '$_id',
      _id: 0,
      works: 1,
    },
  },
  ]).sort({ year: -1 });
}

export async function getWorkDetailLocaleFromId(workId: string, locale: Locale = 'fr'): Promise<WorkLocaleInt | PieceLocaleInt> {
  const result = await WorkModel.aggregate<WorkLocaleInt | PieceLocaleInt>([
    {
      $match: {
        _id: new Types.ObjectId(workId),
      },
    }, {
      $addFields: {
        pieces: {
          $map: {
            input: '$pieces',
            as: 'piece',
            in: {
              _id: '$$piece._id',
              title: '$$piece.title',
              year: '$$piece.year',
              dimension: '$$piece.dimension',
              material: `$$piece.material.${locale}`,
              imageUrl: '$$piece.imageUrl',
              description: `$$piece.description.${locale}`,
              locale: locale,
            },
          },
        },
      },
    }, {
      $replaceRoot: {
        newRoot: {
          $cond: {
            if: {
              $eq: ['$title', 'N/A'],
            },
            then: {
              $arrayElemAt: ['$pieces',
                0,
              ],
            },
            else: '$$ROOT',
          },
        },
      },
    }, {
      $project: {
        'pieces.year': 0,
        'pieces.dimension': 0,
        'pieces.material': 0,
        'pieces.description': 0,
      },
    },
  ]);
  return result[0];
}

export async function fetchPieceFromWork(workId: string, pieceId: string, locale: Locale = 'fr'): Promise<PieceLocaleInt> {
  const result = await WorkModel.aggregate<PieceLocaleInt>([
    {
      $match: {
        _id: new Types.ObjectId(workId),
        pieces: {
          $elemMatch: {
            _id: new Types.ObjectId(pieceId),
          },
        },
      },
    }, {
      $replaceWith: {
        $arrayElemAt: [
          {
            $filter: {
              input: '$pieces',
              as: 'piece',
              cond: { $eq: ['$$piece._id', new Types.ObjectId(pieceId)] },
            },
          },
          0,
        ],
      },
    }, {
      $addFields: {
        material: `$material.${locale}`,
        description: `$description.${locale}`,
        locale: locale,
      },
    },
  ]);
  return result[0];
}

export async function fetchAllShowcaseImages(): Promise<WorkImgInt[]> {
  const result = await WorkModel.aggregate<WorkImgInt>([
    {
      $match: {
        showcase: true,
      },
    },
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
            input: { $arrayElemAt: ['$pieces', 0] },
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        imageUrl: 1,
      },
    },
  ]);
  return result;
}
