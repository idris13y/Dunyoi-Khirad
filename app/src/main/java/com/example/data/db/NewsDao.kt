package com.example.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface NewsDao {
    @Query("SELECT * FROM news ORDER BY createdAt DESC")
    fun getAllNewsFlow(): Flow<List<NewsEntity>>

    @Query("SELECT * FROM news ORDER BY createdAt DESC")
    suspend fun getAllNews(): List<NewsEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNews(news: NewsEntity)

    @Query("DELETE FROM news WHERE id = :id")
    suspend fun deleteNewsById(id: String)
}
