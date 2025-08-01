"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Textarea } from "../../../../components/ui/textarea";
import { Plus, Search, Edit, Trash2, Upload, Calendar, Clock, FileText, ArrowLeft, Download } from "lucide-react";
import Header from '../../../../components/Header';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  type: "homework" | "project" | "lab";
  status: "active" | "draft" | "closed";
  maxPoints: number;
  submissionCount: number;
  files: string[];
  createdAt: string;
}

export default function AssignmentsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseName, setCourseName] = useState("");

  // Form state
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    type: "homework" as "homework" | "project" | "lab",
    maxPoints: 100,
    files: [] as File[]
  });

  useEffect(() => {
    // Simulate API call to fetch assignments and course info
    setTimeout(() => {
      setCourseName("Introduction to Computer Science (CS101)");
      setAssignments([
        {
          id: "a1",
          title: "Basic Programming Assignment",
          description: "Implement basic programming concepts using variables, loops, and functions",
          dueDate: "2024-02-15",
          type: "homework",
          status: "active",
          maxPoints: 100,
          submissionCount: 42,
          files: ["assignment1_instructions.pdf", "starter_code.zip"],
          createdAt: "2024-01-15"
        },
        {
          id: "a2",
          title: "Algorithm Design Project",
          description: "Design and implement sorting algorithms with performance analysis",
          dueDate: "2024-02-28",
          type: "project",
          status: "draft",
          maxPoints: 200,
          submissionCount: 0,
          files: ["project_requirements.pdf"],
          createdAt: "2024-01-20"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [courseId]);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAssignment = () => {
    const assignment: Assignment = {
      id: `a${Date.now()}`,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      type: newAssignment.type,
      status: "draft",
      maxPoints: newAssignment.maxPoints,
      submissionCount: 0,
      files: newAssignment.files.map(file => file.name),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAssignments([...assignments, assignment]);
    setNewAssignment({
      title: "",
      description: "",
      dueDate: "",
      type: "homework",
      maxPoints: 100,
      files: []
    });
    setShowCreateForm(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewAssignment(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

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
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="border-gray-300 dark:border-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Assignments</h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                {courseName}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Create Assignment Form */}
        {showCreateForm && (
          <Card className="shadow-xl border border-gray-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <CardDescription>Upload assignment materials and set requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Assignment Title</label>
                  <Input
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, type: e.target.value as "homework" | "project" | "lab" }))}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="homework">Homework</option>
                    <option value="project">Project</option>
                    <option value="lab">Lab</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Points</label>
                  <Input
                    type="number"
                    value={newAssignment.maxPoints}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, maxPoints: parseInt(e.target.value) }))}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed assignment instructions..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload Files</label>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                {newAssignment.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newAssignment.files.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleCreateAssignment} className="bg-green-600 hover:bg-green-700">
                Create Assignment
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Search */}
        <Card className="shadow-xl border border-gray-100 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-lg border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {assignment.type}
                      </Badge>
                      <Badge variant={assignment.status === "active" ? "default" : "secondary"}>
                        {assignment.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Due: {assignment.dueDate}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Max Points</p>
                    <p className="text-lg font-bold">{assignment.maxPoints}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Submissions:</span>
                    <span className="font-medium ml-2">{assignment.submissionCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium ml-2">{assignment.createdAt}</span>
                  </div>
                </div>

                {assignment.files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Attached Files:</p>
                    <div className="space-y-1">
                      {assignment.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                          <FileText className="h-4 w-4" />
                          <span>{file}</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View Submissions
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <Card className="shadow-xl border border-gray-100 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No assignments found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm ? "Try adjusting your search criteria" : "Create your first assignment to get started"}
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
           
