import type { Locale } from '~/types/locale';
import { type PieceLocaleInt, type WorkImgInt, type WorkLocaleInt, WorkModel, type WorkTitleInt } from './WorkModel';
import { Types } from 'mongoose';

export async function getAllWorkTitles(locale: Locale = 'fr'): Promise<WorkTitleInt[]> {
  return await WorkModel.aggregate<WorkTitleInt>([{
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
        type: {
          $cond: {
            if: { $eq: ['$title', 'N/A'] },
            then: 'piece',
            else: 'series',
          },
        },
        firstPiece: { $arrayElemAt: ['$pieces', 0] },
      }
    },
    {
      $addFields: {
        'firstPiece.material': `$firstPiece.material.${locale}`,
        'firstPiece.description': `$firstPiece.description.${locale}` ,
        locale: `${locale}`
      }
    },
    {
      $project: {
        pieces: 0
      }
    }
  ]).sort({ year: 'desc' });
}

export async function getWorkDetailLocaleFromId(workId: string, locale: Locale = 'fr'): Promise<WorkLocaleInt | PieceLocaleInt> {
  const result = await WorkModel.aggregate<WorkLocaleInt | PieceLocaleInt>([
    {
      $match: {
        _id: new Types.ObjectId(workId)
      }
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
              locale: locale
            }
          }
        }
      }
    }, {
      $replaceRoot: {
        newRoot: {
          $cond: {
            if: {
              $eq: ['$title', 'N/A']
            },
            then: {
              $arrayElemAt: ['$pieces',
                0
              ]
            },
            else: '$$ROOT'
          }
        }
      }
    }, {
      $project: {
        'pieces.year': 0,
        'pieces.dimension': 0,
        'pieces.material': 0,
        'pieces.description': 0
      }
    }
  ])
  return result[0];
}

export async function fetchPieceFromWork(workId: string, pieceId: string, locale: Locale = 'fr'): Promise<PieceLocaleInt> {
  const result = await WorkModel.aggregate<PieceLocaleInt>([
    {
      $match: {
        _id: new Types.ObjectId(workId),
        pieces: {
          $elemMatch: {
            _id: new Types.ObjectId(pieceId)
          }
        }
      }
    }, {
      $replaceWith: {
        $arrayElemAt: [
          {
            $filter: {
              input: '$pieces',
              as: 'piece',
              cond: { $eq: ['$$piece._id', new Types.ObjectId(pieceId)] }
            }
          },
          0
        ]
      }
    }, {
      $addFields: {
        material: `$material.${locale}`,
        description: `$description.${locale}`,
        locale: locale
      }
    }
  ]);
  return result[0];
}

export async function fetchAllShowcaseImages(): Promise<WorkImgInt[]> {
  const result = await WorkModel.aggregate<WorkImgInt>([
    {
      $match: {
        showcase: true
      }
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
            input: { $arrayElemAt: ['$pieces', 0] }
          }
        }
      }
    },
    {
      $project: {
        title: 1,
        imageUrl: 1
      }
    }
  ]);
  return result;
}