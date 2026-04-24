<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;


class AdminController extends Controller
{
    public function createFile(array $file, $model)
    {
        foreach ($file as $key => $value) {
            $checkFiles = Storage::disk('public')->files("model/{$model}");
            if (!$value) return;
            //delete filest to udpate
            foreach ($checkFiles as $deleteFile) {

                if (str_contains($deleteFile, $key)) {
                    $delete = Storage::disk('public')->delete($deleteFile);
                }
            }

            $filename = $key . "." . $value->getClientOriginalExtension();
            $path = $value->storeAs("model/{$model}", $filename, 'public');
        }

        return $filename;
    }
    public function create(Request $request)
    {

        $model = $request->input('model') ?? null;

        $point1 = $request->file('chamfer_point1_data') ?? null;
        $point2 = $request->file('chamfer_point2_data') ?? null;

        //update photo
        $files = ['point1' => $point1, 'point2' => $point2];
        $this->createFile($files, $model);

        return redirect()->back()->with('success', 'Hellos');
    }
}
