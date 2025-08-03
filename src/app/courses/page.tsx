"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Plus, Search, Edit, Trash2, Users, Clock, BookOpen, FileText, HelpCircle, Target, X, Mail } from "lucide-react";
import Header from '../../components/Header';

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  type: "homework" | "project" | "lab";
  status: "active" | "draft" | "closed";
}

interface Quiz {
  id: string;
  title: string;
  scheduledDate: string;
  duration: number; // in minutes
  questions: number;
  status: "scheduled" | "active" | "completed";
}

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  credits: number;
  enrolledStudents: number;
  maxStudents: number;
  schedule: string;
  department: string;
  status: "active" | "inactive" | "draft";
  assignments: Assignment[];
  quizzes: Quiz[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    description: "",
    instructor: "",
    credits: 3,
    maxStudents: 100,
    schedule: "",
    department: ""
  });
  const [editCourse, setEditCourse] = useState({
    name: "",
    code: "",
    description: "",
    instructor: "",
    credits: 3,
    maxStudents: 100,
    schedule: "",
    department: ""
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Simulate API call
    setTimeout(() => {
      setCourses([
        {
          id: "1",
          name: "Introduction to Computer Science",
          code: "CS101",
          description: "Fundamental concepts of computer science and programming",
          instructor: "Dr. Smith",
          credits: 3,
          enrolledStudents: 85,
          maxStudents: 100,
          schedule: "MWF 10:00-11:00",
          department: "Computer Science",
          status: "active",
          assignments: [
            { id: "a1", title: "Basic Programming", dueDate: "2024-02-15", type: "homework", status: "active" },
            { id: "a2", title: "Algorithm Design", dueDate: "2024-02-28", type: "project", status: "draft" }
          ],
          quizzes: [
            { id: "q1", title: "Variables and Data Types", scheduledDate: "2024-02-10", duration: 30, questions: 15, status: "completed" },
            { id: "q2", title: "Control Structures", scheduledDate: "2024-02-20", duration: 45, questions: 20, status: "scheduled" }
          ]
        },
        {
          id: "2",
          name: "Data Structures and Algorithms",
          code: "CS201",
          description: "Advanced data structures and algorithmic problem solving",
          instructor: "Prof. Johnson",
          credits: 4,
          enrolledStudents: 67,
          maxStudents: 80,
          schedule: "TTh 14:00-16:00",
          department: "Computer Science",
          status: "active",
          assignments: [
            { id: "a3", title: "Binary Tree Implementation", dueDate: "2024-02-18", type: "lab", status: "active" },
            { id: "a4", title: "Sorting Algorithms", dueDate: "2024-03-05", type: "project", status: "active" }
          ],
          quizzes: [
            { id: "q3", title: "Array Operations", scheduledDate: "2024-02-12", duration: 40, questions: 18, status: "completed" },
            { id: "q4", title: "Linked Lists", scheduledDate: "2024-02-25", duration: 35, questions: 16, status: "scheduled" }
          ]
        },
        {
          id: "3",
          name: "Database Systems",
          code: "CS301",
          description: "Design and implementation of database management systems",
          instructor: "Dr. Williams",
          credits: 3,
          enrolledStudents: 45,
          maxStudents: 60,
          schedule: "MWF 14:00-15:00",
          department: "Computer Science",
          status: "active",
          assignments: [
            { id: "a5", title: "ER Diagram Design", dueDate: "2024-02-22", type: "homework", status: "active" }
          ],
          quizzes: [
            { id: "q5", title: "SQL Basics", scheduledDate: "2024-02-14", duration: 50, questions: 25, status: "active" }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [mounted]);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.code || !newCourse.instructor) {
      alert("Please fill in all required fields");
      return;
    }

    const courseToAdd: Course = {
      id: (courses.length + 1).toString(),
      name: newCourse.name,
      code: newCourse.code,
      description: newCourse.description,
      instructor: newCourse.instructor,
      credits: newCourse.credits,
      enrolledStudents: 0,
      maxStudents: newCourse.maxStudents,
      schedule: newCourse.schedule,
      department: newCourse.department,
      status: "active",
      assignments: [],
      quizzes: []
    };

    setCourses([...courses, courseToAdd]);
    setNewCourse({
      name: "",
      code: "",
      description: "",
      instructor: "",
      credits: 3,
      maxStudents: 100,
      schedule: "",
      department: ""
    });
    setShowAddForm(false);
  };

  const resetForm = () => {
    setNewCourse({
      name: "",
      code: "",
      description: "",
      instructor: "",
      credits: 3,
      maxStudents: 100,
      schedule: "",
      department: ""
    });
    setShowAddForm(false);
  };

  const handleEditCourse = (course: Course) => {
    setEditCourse({
      name: course.name,
      code: course.code,
      description: course.description,
      instructor: course.instructor,
      credits: course.credits,
      maxStudents: course.maxStudents,
      schedule: course.schedule,
      department: course.department
    });
    setSelectedCourse(course);
    setShowEditForm(true);
  };

  const handleUpdateCourse = () => {
    if (!editCourse.name || !editCourse.code || !editCourse.instructor) {
      alert("Please fill in all required fields");
      return;
    }

    setCourses(courses.map(course => 
      course.id === selectedCourse?.id 
        ? {
            ...course,
            name: editCourse.name,
            code: editCourse.code,
            description: editCourse.description,
            instructor: editCourse.instructor,
            credits: editCourse.credits,
            maxStudents: editCourse.maxStudents,
            schedule: editCourse.schedule,
            department: editCourse.department
          }
        : course
    ));
    
    setShowEditForm(false);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCourse = () => {
    if (selectedCourse) {
      setCourses(courses.filter(course => course.id !== selectedCourse.id));
    }
    setShowDeleteDialog(false);
    setSelectedCourse(null);
  };

  const handleViewStudents = (course: Course) => {
    setSelectedCourse(course);
    setShowStudentsModal(true);
  };

  const resetEditForm = () => {
    setEditCourse({
      name: "",
      code: "",
      description: "",
      instructor: "",
      credits: 3,
      maxStudents: 100,
      schedule: "",
      department: ""
    });
    setShowEditForm(false);
    setSelectedCourse(null);
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Course Management</h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Manage courses, instructors, and enrollment
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </div>

        {/* Add Course Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">Add New Course</CardTitle>
                    <CardDescription>Create a new course for your department</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetForm}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Course Name *</label>
                    <Input
                      value={newCourse.name}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Introduction to Computer Science"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Course Code *</label>
                    <Input
                      value={newCourse.code}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g., CS101"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Description</label>
                  <Textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the course"
                    className="border-gray-300 dark:border-gray-600 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Instructor *</label>
                    <Input
                      value={newCourse.instructor}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, instructor: e.target.value }))}
                      placeholder="e.g., Dr. John Smith"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Department</label>
                    <Input
                      value={newCourse.department}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Computer Science"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Credits</label>
                    <Input
                      type="number"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                      min="1"
                      max="6"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Max Students</label>
                    <Input
                      type="number"
                      value={newCourse.maxStudents}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 100 }))}
                      min="1"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Schedule</label>
                    <Input
                      value={newCourse.schedule}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, schedule: e.target.value }))}
                      placeholder="e.g., MWF 10:00-11:00"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="flex-1 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCourse}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Add Course
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Edit Course Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">Edit Course</CardTitle>
                    <CardDescription>Update course information</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetEditForm}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Course Name *</label>
                    <Input
                      value={editCourse.name}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Introduction to Computer Science"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Course Code *</label>
                    <Input
                      value={editCourse.code}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g., CS101"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Description</label>
                  <Textarea
                    value={editCourse.description}
                    onChange={(e) => setEditCourse(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the course"
                    className="border-gray-300 dark:border-gray-600 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Instructor *</label>
                    <Input
                      value={editCourse.instructor}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, instructor: e.target.value }))}
                      placeholder="e.g., Dr. John Smith"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Department</label>
                    <Input
                      value={editCourse.department}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Computer Science"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Credits</label>
                    <Input
                      type="number"
                      value={editCourse.credits}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                      min="1"
                      max="6"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Max Students</label>
                    <Input
                      type="number"
                      value={editCourse.maxStudents}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 100 }))}
                      min="1"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Schedule</label>
                    <Input
                      value={editCourse.schedule}
                      onChange={(e) => setEditCourse(prev => ({ ...prev, schedule: e.target.value }))}
                      placeholder="e.g., MWF 10:00-11:00"
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetEditForm}
                  className="flex-1 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateCourse}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Update Course
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Delete Course Confirmation Dialog */}
        {showDeleteDialog && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Delete Course
                </CardTitle>
                <CardDescription>
                  This action cannot be undone. This will permanently delete the course and all associated data.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Course:</strong> {selectedCourse.name} ({selectedCourse.code})
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    <strong>Enrolled Students:</strong> {selectedCourse.enrolledStudents}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmDeleteCourse}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Course
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Students Modal */}
        {showStudentsModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      Students - {selectedCourse.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedCourse.enrolledStudents} enrolled out of {selectedCourse.maxStudents} max students
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowStudentsModal(false)}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Enrollment Progress */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Enrollment Status</span>
                      <span className="text-sm text-blue-600 dark:text-blue-300">
                        {Math.round((selectedCourse.enrolledStudents / selectedCourse.maxStudents) * 100)}% Full
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(selectedCourse.enrolledStudents / selectedCourse.maxStudents) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Sample Student List - This would come from a real database */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Enrolled Students</h4>
                    <div className="grid gap-2">
                      {Array.from({ length: selectedCourse.enrolledStudents }, (_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {String.fromCharCode(65 + (i % 26))}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Student {i + 1}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                student{i + 1}@university.edu
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Active
                            </Badge>
                            <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Student Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Add New Student</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter student email..."
                        className="flex-1 border-gray-300 dark:border-gray-600"
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="shadow-xl border border-gray-100 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses by name, code, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <Button variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.filter(course => course.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Enrollment</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.length > 0 ? Math.round(courses.reduce((sum, course) => {
                      const enrollmentRate = course.maxStudents > 0 ? (course.enrolledStudents / course.maxStudents * 100) : 0
                      return sum + enrollmentRate
                    }, 0) / courses.length) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.reduce((sum, course) => sum + course.assignments.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.reduce((sum, course) => sum + course.quizzes.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{course.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {course.code}
                      </Badge>
                      <Badge variant={course.status === "active" ? "default" : "secondary"} 
                             className={course.status === "active" 
                               ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                               : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}>
                        {course.status}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{course.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Instructor:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{course.instructor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Credits:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{course.credits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Schedule:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{course.schedule}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Enrollment:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.enrolledStudents}/{course.maxStudents}
                    </span>
                  </div>
                </div>

                {/* Content Statistics */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Assignments</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{course.assignments.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quizzes</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{course.quizzes.length}</p>
                    </div>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Enrollment Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.maxStudents > 0 ? Math.round((course.enrolledStudents / course.maxStudents) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${course.maxStudents > 0 ? (course.enrolledStudents / course.maxStudents) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleViewStudents(course)}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Students
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                    onClick={() => handleDeleteCourse(course)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-yellow-300 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900 text-yellow-700 dark:text-yellow-400"
                    onClick={() => router.push(`/courses/assignments/${course.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Assignments
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-pink-300 dark:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900 text-pink-700 dark:text-pink-400"
                    onClick={() => router.push(`/courses/quizzes/${course.id}`)}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Quizzes
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card className="shadow-xl border border-gray-100 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No courses found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm ? "Try adjusting your search criteria" : "Get started by adding your first course"}
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
                        onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Course
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}