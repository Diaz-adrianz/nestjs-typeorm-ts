import { BrowseQuery } from 'src/base/dto.base';
import {
  Between,
  FindManyOptions,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export const fillQuery = (obj: any, columns: string, value: any) => {
  const keys = columns.split('.');
  let current = obj;

  keys.forEach((key, index) => {
    if (!(key in current)) {
      current[key] = index === keys.length - 1 ? value : {};
    }
    current = current[key];
  });

  return obj;
};

export type BrowseQueryTransformed = {
  where: Record<string, any> | undefined;
  skip: number | undefined;
  take: number | undefined;
  order: Record<string, any> | undefined;
  withDeleted: boolean | undefined;
};

export const transformBrowseQuery = (
  query: BrowseQuery
): BrowseQueryTransformed => {
  // search
  let search = {};
  if (query.search) {
    query.search.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(search, cols, ILike(`%${val}%`));
    });
  }

  // starts
  let starts = {};
  if (query.starts) {
    query.starts.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(starts, cols, ILike(`${val}%`));
    });
  }

  // where
  let where = {};
  if (query.where) {
    query.where.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(where, cols, val);
    });
  }

  // in
  let in_ = {};
  if (query.in_) {
    query.in_.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(in_, cols, In(val.split(',')));
    });
  }

  // not in
  let nin_ = {};
  if (query.nin_) {
    query.nin_.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(nin_, cols, Not(In(val.split(','))));
    });
  }

  // is null
  let isnull = {};
  if (query.isnull) {
    query.isnull.split('~').forEach((q) => {
      fillQuery(isnull, q, IsNull());
    });
  }

  // gte
  let gte = {};
  if (query.gte) {
    query.gte.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(gte, cols, MoreThanOrEqual(val));
    });
  }

  // lte
  let lte = {};
  if (query.lte) {
    query.lte.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(lte, cols, LessThanOrEqual(val));
    });
  }

  // gt
  let gt = {};
  if (query.gt) {
    query.gt.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(gt, cols, MoreThan(val));
    });
  }

  // lt
  let lt = {};
  if (query.lt) {
    query.lt.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      fillQuery(lt, cols, LessThan(val));
    });
  }

  // between
  let between = {};
  if (query.between) {
    query.between.split('~').forEach((q) => {
      const [cols, val] = q.split(':');
      const [start, end] = val.split(',');
      fillQuery(between, cols, Between(start, end));
    });
  }

  // order by
  let orderBy = {};
  if (query && query.order) {
    query.order.split('+').forEach((q) => {
      const [col, val] = q.split(':');
      orderBy[col] = val;
    });
  }

  // pagination
  let pagination = {};

  if (query.paginate == 'true') {
    if (query.limit && +query.limit > 0) {
      pagination['take'] = query.limit;
    }

    if (pagination['take']) {
      const page = query.page && +query.page > 0 ? +query.page : 1;
      pagination['skip'] = +(page - 1) * (pagination['take'] || 0);
    }
  }

  // trash
  let trash = false;
  if (query.trash == 'true') {
    trash = true;
    where['deletedAt'] = Not(IsNull());
  }

  // all
  if (query.all == 'true') {
    trash = true;
    delete where['deletedAt'];
  }

  const typeormQuery: BrowseQueryTransformed = {
    where: {
      ...search,
      ...starts,
      ...where,
      ...in_,
      ...nin_,
      ...isnull,
      ...gte,
      ...lte,
      ...gt,
      ...lt,
      ...between,
    },
    skip: pagination['skip'],
    take: pagination['take'],
    order: orderBy,
    withDeleted: trash,
  };

  console.log;

  return typeormQuery;
};
