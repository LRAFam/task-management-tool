<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the user's tasks, with optional filtering.
     */
    public function index(Request $request)
    {
        $query = Task::with(['user', 'category'])->where('user_id', $request->user()->id);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('completed')) {
            $query->where('completed', $request->completed);
        }

        $tasks = $query->orderByDesc('deadline')->get();
        return response()->json($tasks);
    }

    /**
     * Store a newly created task for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'category_id' => 'nullable|exists:categories,id',
        ]);
        $validated['user_id'] = $request->user()->id;
        $task = Task::create($validated);
        $task->load(['user', 'category']); // Eager load user and category
        return response()->json($task, 201);
    }

    /**
     * Display the specified task (only if it belongs to the user).
     */
    public function show(Task $task, Request $request)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $task->load(['user', 'category']);
        return response()->json($task);
    }

    /**
     * Update the specified task (only if it belongs to the user).
     */
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'category_id' => 'nullable|exists:categories,id',
            'completed' => 'sometimes|boolean',
        ]);
        $task->update($validated);
        $task->load(['user', 'category']);
        return response()->json($task);
    }

    /**
     * Remove the specified task (only if it belongs to the user).
     */
    public function destroy(Task $task, Request $request)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }
}
