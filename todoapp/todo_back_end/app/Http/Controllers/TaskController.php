<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::where('user_id', Auth::id())->with('category')->paginate(2);
        return response()->json($tasks);
    }
    public function categories(Request $request)
    {
        $tasks = Category::all();
        return response()->json($tasks);
    }
    public function getTask(Request $request,$id)
    {
         $task = Task::findOrFail($id);
        return response()->json($task);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,completed',
            'category_id' => 'required|exists:categories,id',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'user_id' => Auth::id(),
            'category_id' => $request->category_id,
        ]);


        return response()->json($task, 201);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,completed',
            'category_id' => 'required|exists:categories,id',
        ]);

        $task = Task::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'category_id' => $request->category_id,
        ]);

        return response()->json($task);
    }
    public function destroy($id)
    {
        $task = Task::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
     public function restore($id)
    {
        $task = Task::onlyTrashed()
                    ->where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();

        $task->restore();

        return response()->json(['message' => 'Task restored successfully', 'task' => $task]);
    }
}
