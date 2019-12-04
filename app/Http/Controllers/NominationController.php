<?php

namespace App\Http\Controllers;

use App\Nominee;
use Illuminate\Http\Request;

class NominationController extends Controller
{

    public function publishedTitles()
    {
        $client = new \GuzzleHttp\Client();

        $post_request = $client->request('POST', 'http://hrinfoapi.ateneo.edu:8080/pub', [
            'form_params' => [
                'email' => 'edelara-tuprio@ateneo.edu',
            ],
        ]);

        return json_decode($post_request->getBody()->getContents());
    }

    public function nominate(Request $req)
    {
        $input_title = $req->title;
        $input_keywords = explode(' ', $req->keywords);

        $nominee = new Nominee();
        $nominee->published_title = $input_title;
        $nominee->keywords = json_encode($input_keywords);
        $nominee->save();

        return $req;
    }

    private function getPossibleResults(array $nominees, string $pattern)
    {
        $collected_results = [];
        if (count($nominees) > 0) {
            foreach ($nominees as $key => $nominee) {
                if (!empty($nominee)) {
                    if (preg_match_all($pattern, $nominee['keywords'], $matches, PREG_SET_ORDER, 0)) {
                        $collected_results[] = [
                            'title' => $nominee['published_title'],
                            'results' => $matches,
                        ];
                    }
                }
            }
        }
        return $collected_results;
    }

    private function getSearchPattern(array $_keywords)
    {
        if (count($_keywords)) {
            $seperated_key = implode('|',
                array_map(function ($keyword) {
                    return '\b' . $keyword;
                }, $_keywords)
            );

            // * Serve as Regular Expression (Case Insensitive)
            $pattern_params = [
                '/',
                $seperated_key,
                '/',
                'mi',
            ];

            return implode('', $pattern_params);
        }
        return '';
    }

    public function search(Request $req)
    {
        $inputted_keywords = array_filter(
            explode(' ', $req->keywords)
        );

        $pattern = $this->getSearchPattern($inputted_keywords);
        $results = Nominee::select('keywords', 'published_title')->get()->toArray();

        if ($req->keywords != null) {
            return $this->getPossibleResults($results, $pattern);
        }

        return [];
    }
}
