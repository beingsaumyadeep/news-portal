"use client";
import React from "react";

function Preference({
  handleSetPreferenceCookie,
  preference,
}: {
  handleSetPreferenceCookie: ({
    category,
    country,
    source,
  }: {
    category?: string | undefined;
    country?: string | undefined;
    source?: string | undefined;
  }) => void;
  preference: {
    category?: string | undefined;
    country?: string | undefined;
    source?: string | undefined;
  };
}) {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState<string | undefined>(
    preference.category
  );
  const [country, setCountry] = React.useState<string | undefined>(
    preference.country
  );
  const [source, setSource] = React.useState<string | undefined>(
    preference.source
  );

  const onSave = async () => {
    try {
      await handleSetPreferenceCookie({ category, country, source });
      window.location.reload();
    } catch (error) {
      console.error("Error setting preference cookie:", error);
    }
  };

  return (
    <div className="bg-primary py-2 text-white">
      <div className="max-w-7xl mx-auto px-3 ">
        <button
          onClick={() => setOpen(!open)}
          className="font-medium text-white bg-primary rounded hover:bg-primary/80 transition-colors text-xs cursor-pointer"
        >
          Preferences
        </button>
      </div>
      {open && (
        <div className="max-w-7xl grid md:grid-cols-6 grid-cols-4 mx-auto px-3 gap-3">
          <select
            name="category"
            value={category}
            className="my-2 border border-zinc-700 py-1 text-xs"
            onChange={(e) => {
              if (e.target.value === "-" || e.target.value === "") {
                setCategory(undefined);
              } else {
                setCategory(e.target.value);
              }
            }}
          >
            <option>Select Category</option>
            <option value="">-</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="technology">Technology</option>
          </select>
          <select
            name="country"
            value={country}
            className="my-2 border border-zinc-700 py-1 text-xs"
            onChange={(e) => setCountry(e.target.value)}
          >
            <option>Select Country</option>
            <option value="">-</option>
            <option value="ae">UAE</option>
            <option value="ar">Argentina</option>
            <option value="at">Austria</option>
            <option value="au">Australia</option>
            <option value="be">Belgium</option>
            <option value="bg">Bulgaria</option>
            <option value="br">Brazil</option>
            <option value="ca">Canada</option>
            <option value="ch">Switzerland</option>
            <option value="cn">China</option>
            <option value="co">Colombia</option>
            <option value="cu">Cuba</option>
            <option value="cz">Czech Republic</option>
            <option value="de">Germany</option>
            <option value="eg">Egypt</option>
            <option value="fr">France</option>
            <option value="gb">United Kingdom</option>
            <option value="gr">Greece</option>
            <option value="hk">Hong Kong</option>
            <option value="hu">Hungary</option>
            <option value="id">Indonesia</option>
            <option value="ie">Ireland</option>
            <option value="il">Israel</option>
            <option value="in">India</option>
            <option value="it">Italy</option>
            <option value="jp">Japan</option>
            <option value="kr">South Korea</option>
            <option value="lt">Lithuania</option>
            
            <option value="ru">Russia</option>
            <option value="sa">Saudi Arabia</option>
            <option value="se">Sweden</option>
            <option value="sg">Singapore</option>
            <option value="si">Slovenia</option>
            <option value="sk">Slovakia</option>
            <option value="th">Thailand</option>
            <option value="tr">Turkey</option>
            <option value="tw">Taiwan</option>
            <option value="ua">Ukraine</option>
            <option value="us">United States</option>
            <option value="ve">Venezuela</option>
            <option value="za">South Africa</option>
          </select>
          <select
            name="source"
            value={source}
            className="my-2 border border-zinc-700 py-1 text-xs"
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">Select Source</option>
            <option value="newsapi">NewsAPI.org</option>
            <option value="nytimes">New York Times</option>
            <option value="guardian">The Guardian</option>
          </select>
          <button
            onClick={onSave}
            className="my-2 bg-primary-foreground text-primary py-1 text-xs cursor-pointer"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default Preference;
