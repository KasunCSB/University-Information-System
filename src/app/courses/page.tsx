"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Users, Clock, BookOpen } from "lucide-react";
import Header from '@/components/Header';

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
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          status: "active"
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
          status: "active"
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
          status: "active"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container-responsive">
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
      
      <div className="container-responsive space-y-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 dark:text-white">Course Management</h1>
            <p className="text-gray-600 dark:text-gray-300 text-responsive-lg mt-2">
              Manage courses, instructors, and enrollment
            </p>
          </div>
          <Button className="shadow-lg transition-all duration-200 transform hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses by name, code, or instructor..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid-responsive-4">
          <Card className="hover:shadow-xl transition-shadow">
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
          
          <Card className="hover:shadow-xl transition-shadow">
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
          
          <Card className="hover:shadow-xl transition-shadow">
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
          
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Enrollment</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.length > 0 ? Math.round(courses.reduce((sum, course) => sum + (course.enrolledStudents / course.maxStudents * 100), 0) / courses.length) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid-responsive-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{course.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {course.code}
                      </Badge>
                      <Badge variant={course.status === "active" ? "default" : "secondary"} 
                             className={course.status === "active" 
                               ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                               : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}>
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

                {/* Enrollment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Enrollment Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round((course.enrolledStudents / course.maxStudents) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(course.enrolledStudents / course.maxStudents) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  Manage
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No courses found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm ? "Try adjusting your search criteria" : "Get started by adding your first course"}
                </p>
                <Button className="shadow-lg transition-all duration-200 transform hover:scale-105">
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