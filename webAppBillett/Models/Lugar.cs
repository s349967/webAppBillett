﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace webAppBillett.Models
{
    public class Lugar
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int lugarId { get; set; }


        public String bildeURL { get; set; }
        public String beskrivelse { get; set; }

        public String tittel { get; set; }

        public double pris { get; set; }

        public virtual List<BillettLugar> billettLugar { get; set; }


        // public bool harWc { get; set; }
        // public String wciIconURL { get; set; }

        // public bool harDysj { get; set; }
        // public String dysjIconURL { get; set; }

        // public bool harWifi { get; set; }
        // public String wifiIconURL { get; set; }

        //  public int antPlasser { get; set; }
        //  public String plassIconURL { get; set; }


        // public String pris { get; set; }
        //  public String prisIconURL { get; set; }


    }
}