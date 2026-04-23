<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


class AdminController extends Controller
{
    public function create(Request $request)
    {
        return redirect()->back();
    }
}
