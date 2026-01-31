<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Data;
use Exception;
use Inertia\Inertia;
use Inertia\Response;
class MachiningChecklistController extends Controller
{
    public function inprocess(Request $request)
    {
        $lot =  $request->input('lot');
        $model = $request->input('model');
        $total_lot =  $request->input('total_lot');
        $isLotExist = Data::where('lot' ,$lot)->first();

        if(   $lot && !$total_lot ){
            $theme =  !$isLotExist ? 'success-container':'error-container';
            $isExist = !$isLotExist ? ' not  exist save data':' exist update data';
            $message = $model . ' Lot No.: '. $lot  .$isExist;
            return Inertia::render('Home', [
                'flash' => [  $theme => $message],
                'LotData' => $isLotExist ? true:false,
                'detailsLot' =>$isLotExist
            ]);
        }

        $validated = $request->validate([
            'model' => 'required|string',
            'lot'   => 'required|string',
            'date'  => 'required|date',
        ]);




        try{

            Data::create([
                    ...$request->except(['pt_data', 'barrelling','timer']),
                    'barrelling' => json_encode($request->barrelling),
                    'pt_data' => json_encode($request->pt_data),
                    'timer'=> json_encode($request->timer),
                ]);
            return Inertia::render('Home', [
                'flash' => ['success-container' => $request->input('model') . ' Lot No.: '. $lot  . ' saved successfully!']
            ]);
        }catch(Exception $e){
            dd($e);
        }

    }
}
