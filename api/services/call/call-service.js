const Call = require('../../models/call')
const CallFilter = require('./call-filter')
const mongoose = require('mongoose')

class CallService {
  // base methods - START
  async get (filter) {
    const callFilter = new CallFilter({
      id: filter.id,
      call_id: filter.call_id
    })
      .getFilter()
    const record = await Call
      .findOne(callFilter)
      .exec()
    return record
  }

  async getAll (filter) {
    const callFilter = new CallFilter({
      id: filter.id,
      ids: filter.ids,
      call_id: filter.call_id,
      status: filter.status
    })
      .getFilter()
    const record = await Call
      .find(callFilter)
      .exec()
    return record
  }

  async create (userid, data) {
    if (userid) {
      data.room = mongoose.Types.ObjectId(data.room)
      data.user = mongoose.Types.ObjectId(userid)
    }
    let record = new Call(data)
    record = await record.save()
    return record
  }

  async update (id, update) {
    const callFilter = new CallFilter({
      id
    })
      .getFilter()
    const options = {
      new: true
    }
    const record = await Call
      .findOneAndUpdate(callFilter, update, options)
    return record
  }

  async delete (id) {
    const callFilter = new CallFilter({
      id
    })
      .getFilter()
    const result = await Call
      .deleteOne(callFilter)
      .exec()
    return result
  }

  async close (id) {
    const update = {
      status: 'closed'
    }
    const result = await this.update(id, update)
    return result
  }
}

module.exports = new CallService()
