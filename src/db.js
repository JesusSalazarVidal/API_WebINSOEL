import mongoonse from 'mongoose'

export const connectDB = async()=>{
    try {
        await mongoonse.connect("mongodb+srv://jesus:jesus123@cluster0.jlnuhe6.mongodb.net/")
        console.log('DB is connected')
    } catch (error) {
        console.log(error)
    }
}