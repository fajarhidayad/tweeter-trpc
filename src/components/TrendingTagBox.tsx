import React from 'react';

export default function TrendingTagBox() {
  return (
    <div className="bg-white py-2.5 px-5 rounded-xl mb-5">
      <h3 className="font-semibold text-xs text-gray-700 mb-2">
        Trends for you
      </h3>
      <hr />
      <ul>
        <TrendingTagItem tag="programming" count={213} />
        <TrendingTagItem tag="devchallenges" count={42} />
        <TrendingTagItem tag="frontend" count={45} />
        <TrendingTagItem tag="100DaysOfCode" count={123} />
        <TrendingTagItem tag="learntocode" count={10} />
      </ul>
    </div>
  );
}

function TrendingTagItem(props: { tag: string; count: number }) {
  return (
    <li className="mt-6 last:mb-9">
      <p className="font-semibold mb-2">#{props.tag}</p>
      <p className="font-medium text-xs text-gray-500">{props.count} Tweets</p>
    </li>
  );
}
