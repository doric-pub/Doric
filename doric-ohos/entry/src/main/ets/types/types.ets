/*
 * The MIT License (MIT)
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */

export interface idModel {
  id?: number
}

interface urlModel {
  url: string
}

export interface uploadModel {
  code: number,
  msg: string,
  ts: string,
  data: urlModel
}

export interface infoModel {
  id: number
  name: string
  briefDesc: string
  author: string
  licence: string
  gitUrl: string
  keyword: string
}

export interface ConfigModel {
  defaultUrl: string,
  path: string,
  getUrl: string,
  postUrl: string,
  downloadUrl: string,
  uploadUrl: string,
}

export interface normalResultModel {
  code: number,
  data: Object,
  msg: string,
  pageNum: number,
  pageSize: number,
  totalNum: number,
  totalPage: number
}

export interface postDataModel {
  pageNum: number,
  pageSize: number,
  newDate: number
}

export interface downLoadResultModel {
  data: string
}


export interface uploadResultModel {
  code: number,
  msg: string,
  ts: string,
  data: urlModel
}

