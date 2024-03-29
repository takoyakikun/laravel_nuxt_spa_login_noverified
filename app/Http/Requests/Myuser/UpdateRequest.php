<?php

namespace App\Http\Requests\Myuser;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // 一般ユーザ以上を許可
        if (Gate::allows('user-higher')) {
            return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'login_id' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore(\Auth::user())],
        ];
    }
}
