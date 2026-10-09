/** Small vector country marks; adjacent text supplies the accessible label. */
export default function CountryFlag({ country }: { country: "us" | "ca" }) {
  return <svg className="country-flag" viewBox="0 0 30 20" aria-hidden="true">
    <rect width="30" height="20" fill="#fff" />
    {country === "us" ? <>
      {[0, 3.08, 6.16, 9.24, 12.32, 15.4, 18.48].map((y) => <rect key={y} y={y} width="30" height="1.54" fill="#b42336" />)}
      <rect width="13" height="10.77" fill="#244477" />
      {[2, 5, 8].flatMap((y) => [2, 5, 8, 11].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r=".55" fill="#fff" />))}
    </> : <>
      <rect width="7.5" height="20" fill="#bd2437" />
      <rect x="22.5" width="7.5" height="20" fill="#bd2437" />
      <path d="m15 3 1.3 3.2 1.4-.7-.4 4 2-1.5.5 1.5 1.6-.3-1 3.1 1 .8-4.8 1-.3 2.9h-1.2l-.3-2.9-4.8-1 1-.8-1-3.1 1.6.3.5-1.5 2 1.5-.4-4 1.4.7Z" fill="#bd2437" />
    </>}
  </svg>;
}
