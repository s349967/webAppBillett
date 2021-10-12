﻿using System;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace webAppBillett.Models
{
    public class RuteForekomstDatoTid
    {
        public RuteForekomstDatoTid()
        {

        }



        [Key, Column(Order = 0)]
        [Required]
        public int ruteId { get; set; }



        [Key, Column(Order = 1)]
        [Required]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime avgangsDato { get; set; }


        [Key, Column(Order = 2)]
        [DisplayFormat(DataFormatString = "{0:hh:mm}", ApplyFormatInEditMode = true)]
        [Required]
        public DateTime avgangsTid { get; set; }


        [Required]
        public string ankomstDato { get; set; }

        [Required]
        public string ankomstTid { get; set; }
        [Required]

        public int forekomstDatoId { get; set; }

        public bool erUtsolgt { get; set; }
    }
}