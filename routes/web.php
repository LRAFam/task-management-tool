<?php

use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', fn () => response()->json(['status' => 'ok'])); 