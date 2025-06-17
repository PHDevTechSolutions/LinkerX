import { useEffect } from "react";

interface HiddenFieldsProps {
    companyname: string;
    activitynumber: string; setactivitynumber: (value: string) => void;
    referenceid: string; setreferenceid: (value: string) => void;
    manager: string; setmanager: (value: string) => void;
    tsm: string; settsm: (value: string) => void;
    targetquota: string; settargetquota: (value: string) => void;
    startdate: string; setstartdate: (value: string) => void;
    enddate: string; setenddate: (value: string) => void;
    ticketreferencenumber: string; setticketreferencenumber: (value: string) => void;
    wrapup: string; setwrapup: (value: string) => void;
    inquiries: string; setinquiries: (value: string) => void;
    csragent: string; setcsragent: (value: string) => void;
    editPost?: any;
}

const HiddenFields: React.FC<HiddenFieldsProps> = ({
    companyname,
    activitynumber, setactivitynumber,
    referenceid, setreferenceid,
    manager, setmanager,
    tsm, settsm,
    targetquota, settargetquota,
    startdate, setstartdate,
    enddate, setenddate,
    ticketreferencenumber, setticketreferencenumber,
    wrapup, setwrapup,
    inquiries, setinquiries,
    csragent, setcsragent,
    editPost
}) => {

    const generateActivityNumber = () => {
        if (editPost?.activitynumber) return; // Don't regenerate if editing
        if (!companyname || !referenceid) return;

        const firstLetter = companyname.charAt(0).toUpperCase();
        const firstTwoRef = referenceid.substring(0, 2).toUpperCase();

        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
        }).replace("/", "");

        const randomNumber = String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6);
        const generatedNumber = `${firstLetter}-${firstTwoRef}-${formattedDate}-${randomNumber}`;
        setactivitynumber(generatedNumber);
    };

    useEffect(() => {
        if (!editPost) {
            generateActivityNumber();
        } else {
            setactivitynumber(editPost.activitynumber);
        }
    }, [editPost, companyname, referenceid]);

    return (
        <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4 space-y-2">
                {/* Visible but read-only */}
                <input
                    type="hidden"
                    id="activitynumber"
                    value={activitynumber ?? ""}
                    readOnly
                    className="bg-gray-100 text-gray-700 w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />

                {/* Hidden fields */}
                <input type="hidden" id="referenceid" value={referenceid ?? ""} onChange={(e) => setreferenceid(e.target.value)} />
                <input type="hidden" id="manager" value={manager ?? ""} onChange={(e) => setmanager(e.target.value)} />
                <input type="hidden" id="tsm" value={tsm ?? ""} onChange={(e) => settsm(e.target.value)} />
                <input type="hidden" id="targetquota" value={targetquota ?? ""} onChange={(e) => settargetquota(e.target.value)} />
                <input type="hidden" value={startdate ?? ""} onChange={(e) => setstartdate(e.target.value)} />
                <input type="hidden" value={enddate ?? ""} onChange={(e) => setenddate(e.target.value)} />
                <input type="hidden" value={ticketreferencenumber ?? ""} onChange={(e) => setticketreferencenumber(e.target.value)} />
                <input type="hidden" value={wrapup ?? ""} onChange={(e) => setwrapup(e.target.value)} />
                <input type="hidden" value={inquiries ?? ""} onChange={(e) => setinquiries(e.target.value)} />
                <input type="hidden" value={csragent ?? ""} onChange={(e) => setcsragent(e.target.value)} />
            </div>
        </div>
    );
};

export default HiddenFields;
