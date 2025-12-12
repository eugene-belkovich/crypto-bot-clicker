import {connectToDatabase, disconnectFromDatabase} from '../src/config/mongodb-connection';

export async function up(): Promise<void> {
    try {
        await connectToDatabase();

        // Add your migration logic here

        await disconnectFromDatabase();
    } catch (error) {
        console.error('Migration error on up:', error);
        throw error;
    } finally {
        await disconnectFromDatabase();
    }
}

export async function down(): Promise<void> {
    try {
        await connectToDatabase();

        // Add your rollback logic here

        await disconnectFromDatabase();
    } catch (error) {
        console.error('Migration error on down:', error);
        throw error;
    } finally {
        await disconnectFromDatabase();
    }
}
