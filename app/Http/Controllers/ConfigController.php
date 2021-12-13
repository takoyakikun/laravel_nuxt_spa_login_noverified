<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConfigController extends Controller
{

    /**
     * コンフィグを取得する
     *
     * @return \Illuminate\Http\Response
     */
    public function index ()
    {
        // 共通で使える設定を追加
        $allConfigData = config('settings', []);

        // 各権限で使える設定を追加
        $authTypes = ['user-higher', 'admin-higher', 'system-only'];
        foreach ($authTypes as $type) {
            if (\Gate::allows($type)) {
                foreach(config('settings_'.$type, []) as $key => $item) {
                    $allConfigData[$key] = $item;
                }
            }
        }

        $config = [];
        // javascriptで使う形に整形し直す
        foreach ($allConfigData as $configKey => $configValue) {
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
        return response($config);
    }

}
