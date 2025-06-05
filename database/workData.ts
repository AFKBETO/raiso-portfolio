import type { Locale } from '~/types/locale';
import { WorkModel, type WorkTitleInt } from './WorkModel';

export async function getAllWorkTitles(locale: Locale = 'fr') {
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
        pieces: 0,
        showcase: 0
      }
    }
  ]).sort({ year: 'desc' });
}