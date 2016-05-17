var deltaECIE2000 = function($rgb1, $rgb2)
{
	var deg2rad = function(a) { return a * .017453292519943295 },
		rad2deg = function(a) { return a * 57.29577951308232 },

	_rgb2lab = function($rgb)
	{
		return _xyz2lab(_rgb2xyz($rgb));
	},

	_rgb2xyz = function($rgb)
	{
		var $r = $rgb[0],
			$g = $rgb[1],
			$b = $rgb[2];

		$r = $r <= 0.04045 ? $r / 12.92 : Math.pow(($r + 0.055) / 1.055, 2.4);
		$g = $g <= 0.04045 ? $g / 12.92 : Math.pow(($g + 0.055) / 1.055, 2.4);
		$b = $b <= 0.04045 ? $b / 12.92 : Math.pow(($b + 0.055) / 1.055, 2.4);

		$r *= 100;
		$g *= 100;
		$b *= 100;

		$x = $r * 0.412453 + $g * 0.357580 + $b * 0.180423;
		$y = $r * 0.212671 + $g * 0.715160 + $b * 0.072169;
		$z = $r * 0.019334 + $g * 0.119193 + $b * 0.950227;

		return [$x, $y, $z];
	},

	_xyz2lab = function($xyz)
	{
		var $x = $xyz[0],
			$y = $xyz[1],
			$z = $xyz[2];

		$x /= 95.047;
		$y /= 100;
		$z /= 108.883;

		$x = $x > 0.008856 ? Math.pow($x, 1 / 3) : $x * 7.787 + 16 / 116; 
		$y = $y > 0.008856 ? Math.pow($y, 1 / 3) : $y * 7.787 + 16 / 116; 
		$z = $z > 0.008856 ? Math.pow($z, 1 / 3) : $z * 7.787 + 16 / 116; 

		$l = $y * 116 - 16;
		$a = ($x - $y) * 500;
		$b = ($y - $z) * 200;

		return [$l, $a, $b];
	};

	var $lab1   = _rgb2lab($rgb1),
		$l1     = $lab1[0],
		$a1     = $lab1[1],
		$b1     = $lab1[2],

		$lab2   = _rgb2lab($rgb2),
		$l2     = $lab2[0],
		$a2     = $lab2[1],
		$b2     = $lab2[2],
	
		$avg_lp = ($l1 + $l2) / 2,
		$c1     = Math.sqrt(Math.pow($a1, 2) + Math.pow($b1, 2)),
		$c2     = Math.sqrt(Math.pow($a2, 2) + Math.pow($b2, 2)),
		$avg_c  = ($c1 + $c2) / 2,
		$g      = (1 - Math.sqrt(Math.pow($avg_c , 7) / (Math.pow($avg_c, 7) + Math.pow(25, 7)))) / 2,
		$a1p    = $a1 * (1 + $g),
		$a2p    = $a2 * (1 + $g),
		$c1p    = Math.sqrt(Math.pow($a1p, 2) + Math.pow($b1, 2)),
		$c2p    = Math.sqrt(Math.pow($a2p, 2) + Math.pow($b2, 2)),
		$avg_cp = ($c1p + $c2p) / 2,
		$h1p    = rad2deg(Math.atan2($b1, $a1p));

	if($h1p < 0)
	{
		$h1p    += 360;
	}

	var $h2p    = rad2deg(Math.atan2($b2, $a2p));

	if($h2p < 0)
	{
		$h2p    += 360;
	}

	var $avg_hp = Math.abs($h1p - $h2p) > 180 ? ($h1p + $h2p + 360) / 2 : ($h1p + $h2p) / 2,
	$t          = 1 - 0.17 * Math.cos(deg2rad($avg_hp - 30)) + 0.24 * Math.cos(deg2rad(2 * $avg_hp)) + 0.32 * Math.cos(deg2rad(3 * $avg_hp + 6)) - 0.2 * Math.cos(deg2rad(4 * $avg_hp - 63)),
	$delta_hp   = $h2p - $h1p;

	if(Math.abs($delta_hp) > 180)
	{
		if($h2p <= $h1p)
		{
			$delta_hp += 360;
		}
		else
		{
			$delta_hp -= 360;
		}
	}

	var $delta_lp = $l2 - $l1,
		$delta_cp = $c2p - $c1p,
		$delta_hp = 2 * Math.sqrt($c1p * $c2p) * Math.sin(deg2rad($delta_hp) / 2),

		$s_l      = 1 + ((0.015 * Math.pow($avg_lp - 50, 2)) / Math.sqrt(20 + Math.pow($avg_lp - 50, 2))),
		$s_c      = 1 + 0.045 * $avg_cp,
		$s_h      = 1 + 0.015 * $avg_cp * $t,

		$delta_ro = 30 * Math.exp(-(Math.pow(($avg_hp - 275) / 25, 2))),
		$r_c      = 2 * Math.sqrt(Math.pow($avg_cp, 7) / (Math.pow($avg_cp, 7) + Math.pow(25, 7))),
		$r_t      = -$r_c * Math.sin(2 * deg2rad($delta_ro)),

		$kl = $kc = $kh = 1;

	return Math.sqrt(Math.pow($delta_lp / ($s_l * $kl), 2) + Math.pow($delta_cp / ($s_c * $kc), 2) + Math.pow($delta_hp / ($s_h * $kh), 2) + $r_t * ($delta_cp / ($s_c * $kc)) * ($delta_hp / ($s_h * $kh)));
}
