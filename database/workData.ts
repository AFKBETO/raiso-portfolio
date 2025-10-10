import { Types, type PipelineStage } from 'mongoose';
import { type PieceLocaleInt, type PieceWithWorkIdInt, type WorkImgInt, type WorkLocaleInt, WorkModel, type WorkTimelineInt } from './WorkModel';
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
  }, {
    $sort: { year: -1, title: 1 },
  }, {
    $project: {
      pieces: 0,
      showcase: 0,
    },
  }, {
    $group: {
      _id: '$year',
      works: {
        $push: {
          _id: '$_id',
          title: '$title',
        },
      },
    },
  }, {
    $project: {
      year: '$_id',
      _id: 0,
      works: 1,
    },
  }]).sort({ year: -1 });
}

export async function getWorkDetailLocaleFromId(workId: string, locale: Locale = 'fr'): Promise<WorkLocaleInt | PieceLocaleInt> {
  const result = await WorkModel.aggregate<WorkLocaleInt | PieceLocaleInt>([
    {
      $match: {
        _id: new Types.ObjectId(workId),
      },
    }, {
      $addFields: {
        description: {
          $ifNull: [`$description.${locale}`, ''],
        },
        locale: locale,
        pieces: {
          $map: {
            input: '$pieces',
            as: 'piece',
            in: {
              _id: '$$piece._id',
              title: '$$piece.title',
              year: '$$piece.year',
              dimension: '$$piece.dimension',
              material: { $ifNull: [`$$piece.material.${locale}`, ''] },
              imageUrl: '$$piece.imageUrl',
              description: { $ifNull: [`$$piece.description.${locale}`, ''] },
              tags: '$$piece.tags',
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
      $addFields: {
        'pieces.workTitle': {
          $cond: {
            if: { $ne: ['$title', 'N/A'] },
            then: '$title',
            else: '$$REMOVE',
          },
        },
        'pieces.workId': {
          $cond: {
            if: { $ne: ['$title', 'N/A'] },
            then: '$_id',
            else: '$$REMOVE',
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
        material: { $ifNull: [`$material.${locale}`, ''] },
        description: { $ifNull: [`$description.${locale}`, ''] },
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

export async function fetchAllPieces(isShow: boolean = false): Promise<PieceWithWorkIdInt[]> {
  const pipeline: PipelineStage[] = [];
  const piecesFilter = {
    $filter: {
      input: '$pieces',
      as: 'piece',
      cond: { $eq: ['$$piece.isShow', true] },
    },
  };
  pipeline.push({
    $project: {
      pieces: isShow ? piecesFilter : 1,
      title: 1,
    },
  }, {
    $unwind: '$pieces',
  }, {
    $addFields: {
      'pieces.workId': {
        $cond: {
          if: { $ne: ['$title', 'N/A'] },
          then: '$_id',
          else: '$$REMOVE',
        },
      },
      'pieces._id': {
        $cond: {
          if: { $eq: ['$title', 'N/A'] },
          then: '$_id',
          else: '$pieces._id',
        },
      },
      'pieces.isShow': {
        $ifNull: ['$pieces.isShow', false],
      },
      'pieces.priority': {
        $ifNull: ['$pieces.priority', 0],
      },
    },
  }, {
    $replaceRoot: {
      newRoot: '$pieces',
    },
  }, {
    $project: {
      dimension: 0,
      material: 0,
      description: 0,
    },
  });
  const result = await WorkModel.aggregate<PieceWithWorkIdInt>(pipeline).sort({ priority: -1, year: -1, title: 1 });
  return result;
}
