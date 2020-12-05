<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConfigController extends Controller
{

    /**
     * 取得しないコンフィグデータのキー
     *
     * @var array
     */
    protected $hidden = ['roleLevel', 'role'];

    /**
     * コンフィグを取得する
     *
     * @return \Illuminate\Http\Response
     */
    public function index ()
    {
        $config = [];
        // javascriptで使う形に整形し直す
        foreach (\Config::get('settings', []) as $configKey => $configValue) {
            if (in_array($configKey, $this->hidden, true) === false) {
                if (is_array($configValue)) {
                    // javascriptだとキー順に勝手に並び替えられてしまうのでキーはあえて指定しないで配列に追加する
                    foreach ($configValue as $key => $value) {
                        $newValue = [];
                        if (is_array($value)){
                            if (array_values($value) === $value) {
                                // 配列の場合は array に入れる
                                $newValue['array'] = $value;
                            } else {
                                // 連想配列の場合はそのまま入れる
                                $newValue = $value;
                            }
                        } else {
                            // 配列以外の場合は text に入れる
                            $newValue['text'] = $value;
                        }
                        $newValue['value'] = $key; // キーをvalueに追加する
                        $config[$configKey][] = $newValue;
                    }
                } else{
                    $config[$configKey] = $configValue;
                }
            }
        }
        return response($config);
    }

}
