<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        $categories = Category::all()->keyBy('name');

        $tasks = [
            [
                'title' => 'Finish Laravel project',
                'description' => 'Complete the backend API for the task management tool.',
                'deadline' => now()->addDays(3),
                'category_id' => $categories['Work']->id ?? null,
                'completed' => false,
            ],
            [
                'title' => 'Buy groceries',
                'description' => 'Milk, eggs, bread, and fruit.',
                'deadline' => now()->addDays(1),
                'category_id' => $categories['Shopping']->id ?? null,
                'completed' => false,
            ],
            [
                'title' => 'Read a book',
                'description' => 'Read at least 30 pages of a new book.',
                'deadline' => now()->addDays(5),
                'category_id' => $categories['Personal']->id ?? null,
                'completed' => true,
            ],
            [
                'title' => 'Doctor appointment',
                'description' => 'Annual check-up at 10am.',
                'deadline' => now()->addDays(7),
                'category_id' => $categories['Health']->id ?? null,
                'completed' => false,
            ],
            [
                'title' => 'Urgent: Pay bills',
                'description' => 'Electricity and water bills due soon.',
                'deadline' => now()->addDays(2),
                'category_id' => $categories['Urgent']->id ?? null,
                'completed' => false,
            ],
        ];

        foreach ($tasks as $task) {
            Task::create(array_merge($task, ['user_id' => $user->id]));
        }
    }
}
