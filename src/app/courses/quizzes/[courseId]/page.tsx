"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Textarea } from "../../../../components/ui/textarea";
import { Plus, Search, Edit, Trash2, Calendar, Clock, HelpCircle, ArrowLeft, Eye } from "lucide-react";
import Header from '../../../../components/Header';

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number; // in minutes
  questions: Question[];
  status: "scheduled" | "active" | "completed" | "draft";
  totalPoints: number;
  attempts: number;
  createdAt: string;
}

export default function QuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseName, setCourseName] = useState("");

  // Form state
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    duration: 30,
    questions: [] as Question[]
  });

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "multiple-choice" as "multiple-choice" | "true-false" | "short-answer",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourseName("Introduction to Computer Science (CS101)");
      setQuizzes([
        {
          id: "q1",
          title: "Variables and Data Types",
          description: "Test understanding of basic programming concepts",
          scheduledDate: "2024-02-10",
          duration: 30,
          questions: [
            {
              id: "qn1",
              question: "What is a variable in programming?",
              type: "multiple-choice",
              options: ["A storage location", "A function", "A loop", "A condition"],
              correctAnswer: "A storage location",
              points: 2
            }
          ],
          status: "completed",
          totalPoints: 15,
          attempts: 85,
          createdAt: "2024-01-25"
        },
        {
          id: "q2",
          title: "Control Structures",
          description: "Assessment of loops and conditional statements",
          scheduledDate: "2024-02-20",
          duration: 45,
          questions: [],
          status: "scheduled",
          totalPoints: 20,
          attempts: 0,
          createdAt: "2024-02-01"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [courseId]);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addQuestion = () => {
    if (newQuestion.question.trim()) {
      const question: Question = {
        id: `qn${Date.now()}`,
        question: newQuestion.question,
        type: newQuestion.type,
        options: newQuestion.type === "multiple-choice" ? newQuestion.options.filter(opt => opt.trim()) : undefined,
        correctAnswer: newQuestion.correctAnswer,
        points: newQuestion.points
      };
      
      setNewQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, question]
      }));
      
      setNewQuestion({
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 1
      });
    }
  };

  const handleCreateQuiz = () => {
    const quiz: Quiz = {
      id: `q${Date.now()}`,
      title: newQuiz.title,
      description: newQuiz.description,
      scheduledDate: newQuiz.scheduledDate,
      duration: newQuiz.duration,
      questions: newQuiz.questions,
      status: "draft",
      totalPoints: newQuiz.questions.reduce((sum, q) => sum + q.points, 0),
      attempts: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setQuizzes([...quizzes, quiz]);
    setNewQuiz({
      title: "",
      description: "",
      scheduledDate: "",
      duration: 30,
      questions: []
    });
    setShowCreateForm(false);
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
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                {courseName}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {/* Create Quiz Form */}
        {showCreateForm && (
          <Card className="shadow-xl border border-gray-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Create New Quiz</CardTitle>
              <CardDescription>Set up quiz details and add questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quiz Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quiz Title</label>
                  <Input
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={newQuiz.duration}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    placeholder="30"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Scheduled Date</label>
                  <Input
                    type="date"
                    value={newQuiz.scheduledDate}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide quiz instructions..."
                  rows={3}
                />
              </div>

              {/* Add Questions Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Questions</h3>
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Question</label>
                    <Input
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter your question"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Question Type</label>
                      <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as "multiple-choice" | "true-false" | "short-answer" }))}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Points</label>
                      <Input
                        type="number"
                        value={newQuestion.points}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {newQuestion.type === "multiple-choice" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Options</label>
                      <div className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <Input
                            key={index}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion(prev => ({ ...prev, options: newOptions }));
                            }}
                            placeholder={`Option ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">Correct Answer</label>
                    <Input
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      placeholder="Enter correct answer"
                    />
                  </div>

                  <Button onClick={addQuestion} variant="outline">
                    Add Question
                  </Button>
                </div>

                {/* Added Questions */}
                {newQuiz.questions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Added Questions ({newQuiz.questions.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {newQuiz.questions.map((question, index) => (
                        <div key={question.id} className="p-2 border rounded text-sm">
                          <span className="font-medium">Q{index + 1}:</span> {question.question} 
                          <span className="text-gray-500 ml-2">({question.points} pts)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleCreateQuiz} className="bg-green-600 hover:bg-green-700">
                Create Quiz
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
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quizzes List */}
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="shadow-lg border border-gray-100 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant={quiz.status === "active" ? "default" : "secondary"}>
                        {quiz.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {quiz.scheduledDate}
                      </span>
                      <span className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {quiz.duration} min
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Points</p>
                    <p className="text-lg font-bold">{quiz.totalPoints}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Questions:</span>
                    <span className="font-medium ml-2">{quiz.questions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Attempts:</span>
                    <span className="font-medium ml-2">{quiz.attempts}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium ml-2">{quiz.createdAt}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  View Results
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <Card className="shadow-xl border border-gray-100 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm ? "Try adjusting your search criteria" : "Create your first quiz to get started"}
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
       