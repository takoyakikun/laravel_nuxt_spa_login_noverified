<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\MyuserPasswordChangeRequest;

use Tests\TestCase;
use Illuminate\Support\Facades\Validator;

class MyuserPasswordChangeRequestTest extends TestCase
{
    /**
     * バリデーションテスト
     *
     * @param string $item
     * @param string $data
     * @param bool $expect
     * @param array $options
     * @return void
     * @dataProvider dataprovider
     */
    public function testValidation($item, $data, $expect, $options = array()): void
    {
        $request  = new MyuserPasswordChangeRequest();
        $rules    = $request->rules();
        $rule     = \Arr::only($rules, $item);

        $dataList = [$item => $data];
        if ($item === 'password') {
            // 確認パスワードを入力状態にする
            if (isset($options['confirmed'])) {
                $dataList['password_confirmation'] = $options['confirmed'];
            } else {
                $dataList['password_confirmation'] = $data;
            }
        }

        $validator = Validator::make($dataList, $rule);
        $result    = $validator->passes();

        $this->assertEquals($expect, $result);
    }

    /**
     * dataprovider
     *
     * @return array
     */
    public function dataprovider(): array
    {
        return [
            // 現在のパスワード
            'current_password_true' => ['current_password', 'password', true],
            'current_password_required_null' => ['current_password', null, false],
            'current_password_required_empty' => ['current_password', '', false],
            'current_password_min_false' => ['current_password', str_repeat('a', 7), false],
            'current_password_min_true' => ['current_password', str_repeat('a', 8), true],

            // パスワード
            'password_true' => ['password', 'password', true],
            'password_required_null' => ['password', null, false],
            'password_required_empty' => ['password', '', false],
            'password_confirmed' => ['password', 'password', false, ['confirmed' => 'confirmed']],
            'password_min_false' => ['password', str_repeat('a', 7), false],
            'password_min_true' => ['password', str_repeat('a', 8), true],
        ];
    }

}
