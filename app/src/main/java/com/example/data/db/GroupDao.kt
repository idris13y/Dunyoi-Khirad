package com.example.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface GroupDao {
    @Query("SELECT * FROM groups ORDER BY name ASC")
    fun getAllGroupsFlow(): Flow<List<GroupEntity>>

    @Query("SELECT * FROM groups ORDER BY name ASC")
    suspend fun getAllGroups(): List<GroupEntity>

    @Query("SELECT * FROM groups WHERE name = :name LIMIT 1")
    suspend fun getGroupByName(name: String): GroupEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGroup(group: GroupEntity)

    @Query("DELETE FROM groups WHERE name = :name")
    suspend fun deleteGroupByName(name: String)
}
