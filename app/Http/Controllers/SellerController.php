<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Crypt;
use DB;
use Session;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Contracts\Encryption\DecryptException;
class SellerController extends Controller {



    public function GenerateLink(Request $request){
        $timeStamp=date("Y/m/d");
        $id =DB::table('refundcase')->insertGetId(
            ['Seller_Id' => $request->sellerNumber, 'RefundCaseDetail' => $request->getContent(),'RefundCaseStatus'=>'Link Generated','RefundCaseStatusKey'=>'']
        );
        $refundLink= Crypt::encrypt( $timeStamp.'~/'. $id);
        DB::table('caselinks')->insert(
            ['Seller_Id' => $request->sellerNumber, 'RefundCase_ID' => $id,'Generation_Time'=>$timeStamp,'CaseLink'=>$refundLink]
        );
        return config('app.url').'/Customer/Refund/'.$refundLink;
    }

    public function GetSellerAllCases($Id){
        $data= DB::table('refundcase')
            ->select('RefundCaseDetail','RefundCase_Id','RefundCaseStatusKey')
            ->where('Seller_Id', '=',$Id)
            ->get();

       return json_encode($data);
    }

    public function DecryptLink($id){
        try{
        $decryptLink=explode("~/",Crypt::decrypt($id)) ;
            Session::put('CaseId', $decryptLink[1]);
        $now =time();
        $your_date = strtotime($decryptLink[0]);
        $datediff = $now - $your_date;
        $daysDiff= floor($datediff/(60*60*24));
        $Active=DB::table('caselinks')
                ->select('IsActive')
                ->where('RefundCase_Id', '=',$decryptLink[1])
                ->get();

       if($daysDiff<30 && $Active[0]->IsActive==1){

          return view('CustomerRefundForm');
       }


        else
            return view('errors.InvalidLink');
        }
        catch (DecryptException  $e)
        {
            return view('errors.InvalidLink');
        }
    }
    public function DeleteCase($id){

        DB::table('refundcase')->where('RefundCase_ID', '=', $id)->delete();
        DB::table('caselinks')->where('RefundCase_ID', '=', $id)->delete();
    }
    public function UpdateCase(Request $request,$id){

        DB::table('refundcase')
            ->where('RefundCase_Id', '=',$id)
            ->update(['RefundCaseDetail' => $request->getContent()]);
       return 'true';
    }
    public function GetCaseLink($id){

        $refundLink=DB::table('caselinks')
            ->select('CaseLink')
            ->where('RefundCase_ID', '=', $id)
            ->get();
        return config('app.url').'/Customer/Refund/'.$refundLink[0]->CaseLink;
    }
}