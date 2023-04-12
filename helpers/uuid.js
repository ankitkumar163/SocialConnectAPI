
const { uuid } = require('uuidv4');
function generateUniqueId() {
    return uuid();
}
module.exports = {
    generateUniqueId,
};


