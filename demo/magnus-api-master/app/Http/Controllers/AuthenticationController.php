<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{
    public function login(Request $request)
    {
        $this->validate($request, [
            'username' => 'required | string',
            'password' => 'required | string | min:6',
        ]);

        try {
            $user = User::where('username', $request->input('username'))->firstOrFail();
        } catch (ModelNotFoundException $exception) {
            return response()->json([
                'error' => 'User not found.',
            ], 400);
        }

        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'error' => 'User not found',
            ], 400);
        }

        return response()->json([
            'token' => $user->token,
        ]);
    }
}
