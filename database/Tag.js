const pool = require('./pool')

addRecord = async (data) => {
    try {
        var conneciton = pool.getPool()
        var status = true
        for (let i = 0; i < data.tags.length; i++) {
            try {
                const query = {
                    text: 'INSERT INTO tagrecord(userID,tagTypeID,wordID) VALUES($1, $2, $3)',
                    values: [data.userID, data.tags[i].tagtypeid, data.tags[i].wordid]
                }
                record = await conneciton.query(query)
            } catch (error) {
                status = false
                console.log(error)
            }
        }
        return { status: status, message: 'Record successfully added' }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

addTagType = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'INSERT INTO tagtype(tagname,color) VALUES($1, $2)',
            values: [data.tagname, data.color]
        }
        type = await conneciton.query(query)
        if (type.rowCount != 0) {
            return { status: true, message: 'Type successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTagTypeID = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM tagtype WHERE tagname = $1',
            values: [data.tagname]
        }
        type = await conneciton.query(query)
        if (type.rowCount != 0) {
            return { status: true, message: 'Type successfully added', id: type.rows[0].tagtypeid }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTextTag = async (data) => {
    try {
        var conneciton = pool.getPool()
        console.log(data)
        const query = {
            text:
                'SELECT words.wordid, words.word, tt.tagtypeid, tt.tagname FROM (SELECT w.wordid, w.word FROM text t, word w WHERE t.textid = $1 AND w.textid = t.textid) words, tagcount tc, tagtype tt WHERE tc.count = (SELECT MAX(count) FROM tagcount WHERE wordid = words.wordid) AND tc.wordid = words.wordid AND tt.tagtypeid = tc.tagtypeid',
            values: [data.textid]
        }
        type = await conneciton.query(query)
        if (type.rowCount != 0) {
            return { status: true, data: type.rows }
        } else {
            return { status: false, message: 'Query error, please try again ----' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    addRecord,
    getTagTypeID,
    addTagType,
    getTextTag
}
