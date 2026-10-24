package com.example.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface StudentDao {
    @Query("SELECT * FROM students WHERE groupName = :groupName ORDER BY orderIndex ASC")
    fun getStudentsForGroupFlow(groupName: String): Flow<List<StudentEntity>>

    @Query("SELECT * FROM students WHERE groupName = :groupName ORDER BY orderIndex ASC")
    suspend fun getStudentsForGroup(groupName: String): List<StudentEntity>

    @Query("SELECT * FROM students ORDER BY orderIndex ASC")
    suspend fun getAllStudents(): List<StudentEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStudent(student: StudentEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStudents(students: List<StudentEntity>)

    @Update
    suspend fun updateStudent(student: StudentEntity)

    @Query("DELETE FROM students WHERE id = :id")
    suspend fun deleteStudentById(id: String)

    @Query("DELETE FROM students WHERE groupName = :groupName")
    suspend fun deleteStudentsByGroup(groupName: String)

    @Transaction
    suspend fun replaceStudentsForGroup(groupName: String, students: List<StudentEntity>) {
        deleteStudentsByGroup(groupName)
        insertStudents(students)
    }
}
