<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function me()
    {
        $user = Auth::user();

        return response()->json(['data' => ['user' => $user]]);
    }

    public function index()
    {
        $users = User::all();

        return response()->json(['data' => $users]);
    }

    public function show($id)
    {
        try {
            $id = User::findOrFail($id);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return response()->json(['data' => ['user' => $id]]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name_first' => 'required|string|min:3',
            'name_last'  => 'required|string|min:3',
            'username'   => 'required|string|min:6',
            'email'      => 'required|string',
            'password'   => 'required|string|min:6',
            'image_url'  => 'nullable',
        ]);

        $user = User::create(array_merge($request->only(['name_first', 'name_last', 'username', 'email', 'image_url']),
            ['password' => Hash::make($request->input('password')), 'token' => str_random(32)]
        ));

        return response()->json(['success' => 'User created!'], 201)
            ->header('Location', route('users.show', ['id' => $user->id]));
    }

    public function update($id, Request $request)
    {
        try {
            $id = User::findOrFail($id)->update(
                $request->only(['name_first', 'name_last', 'username', 'email', 'image_url'])
            );
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return response()->json(['success' => 'User updated.']);
    }

    public function delete($id)
    {
        try {
            $user = User::findOrFail($id);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user->delete();

        return response()->json(['success' => 'User deleted.']);
    }
}
