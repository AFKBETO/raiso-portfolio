import { WorkModel } from '~/database/WorkModel';

export default defineEventHandler(async (_event): Promise<string> => {
  const works = await WorkModel.find();
  for (const work of works) {
    /* const series = new WorkModel();
    series.title = work.title;
    series.year = work.year;
    series.description = work.description;
    series.isPureProduct = series.isPureProduct;
    series.pieces = []; */
    work.isPureProduct = work.isPureProduct ?? false;
    for (const piece of work.pieces) {
      if (!piece.imageUrls || !piece.imageUrls.length) {
        piece.imageUrls = [piece.imageUrl || ''];
        piece.primaryImageIndex = 0;
      }
      piece.isShow = piece.isShow ?? false;
      if (piece.productInfo) {
        piece.productInfo = {
          isSoldout: piece.productInfo.isSoldout ?? false,
          price: piece.productInfo.price ?? 0,
          categories: piece.productInfo.categories ?? [],
          productTitle: piece.productInfo.productTitle ?? '',
          minQuantity: piece.productInfo.minQuantity ?? 0,
          maxQuantity: piece.productInfo.maxQuantity ?? 0,
        };
      }
      piece.priority = piece.priority ?? 0;
      /* const newPiece: PieceInt = {
        _id: piece._id,
        title: piece.title,
        year: piece.year,
        dimension: piece.dimension,
        material: piece.material,
        imageUrls: piece.imageUrls,
        primaryImageIndex: piece.primaryImageIndex,
        description: piece.description,
        tags: piece.tags,
        isShow: piece.isShow,
      };
      series.pieces.push(newPiece); */
    }
    // wait WorkModel.findByIdAndUpdate(work._id, series, { upsert: true });
    await work.save();
  }
  return 'Migration completed';
});
