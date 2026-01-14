import { Client, Databases, ID, Query } from "appwrite"

const VITE_APPWRITE_PROJECT_ID='69616641003878c072b4'
const VITE_APPWRITE_DATABASE_ID='696168f80029943941ab'
const VITE_APPWRITE_COLLECTION_ID='metrics'

const client = new Client().setEndpoint('https://nyc.cloud.appwrite.io/v1').setProject(VITE_APPWRITE_PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, [
            Query.equal('movie_id', movie.id)
        ])
        
        if(result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            })
        } else {
            await database.createDocument(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1, 
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])
        return result.documents
    } catch(error) {
        console.error(error)
    }
}