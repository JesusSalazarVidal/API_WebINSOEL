import mongoose from 'mongoose'

const imageSchema = mongoose.Schema({
    name: String,
    data: Buffer,
    contectType: String
})

const Image = mongoose.model('Image', imageSchema);

export default Image