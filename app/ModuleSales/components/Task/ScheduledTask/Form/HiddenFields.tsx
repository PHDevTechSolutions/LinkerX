import React from "react";

interface HiddenFieldsProps {
    activitynumber: string;
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
    activitynumber,
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
    return (
        <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <input type="hidden" id="activitynumber" value={activitynumber ?? ""} readOnly={!!editPost} />
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
